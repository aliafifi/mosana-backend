import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection, PublicKey } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
import {
  Verification,
  VerificationDocument,
  VerificationProvider,
  VerificationStatus,
} from './schemas/verification.schema';
import {
  OnChainVerificationResult,
  VERIFICATION_MULTIPLIERS,
  PROVIDER_INFO,
} from './interfaces/verification-provider.interface';
import {
  VerificationResultDto,
  VerificationDetail,
  ProviderListDto,
} from './dto/verification-result.dto';
import { SolanaVerificationService } from './services/solana-verification.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private solanaConnection: Connection;

  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>,
    private configService: ConfigService,
    private solanaVerificationService: SolanaVerificationService,
  ) {
    const rpcUrl = this.configService.get<string>(
      'SOLANA_RPC_URL',
      'https://api.mainnet-beta.solana.com',
    );
    this.solanaConnection = new Connection(rpcUrl, 'confirmed');
  }

  /**
   * Check verification status for a wallet
   */
  async checkVerificationStatus(
    walletAddress: string,
    provider?: VerificationProvider,
  ): Promise<VerificationResultDto> {
    // Get all verifications for this wallet
    const query: any = { walletAddress };
    if (provider) {
      query.provider = provider;
    }

    const verifications = await this.verificationModel
      .find(query)
      .sort({ verifiedAt: -1 });

    // Build result
    const verificationDetails: VerificationDetail[] = [];
    let totalMultiplierBonus = 1.0;
    let highestVerification: VerificationProvider | undefined;
    let highestBonus = 0;

    for (const verification of verifications) {
      // Check if expired
      const isExpired =
        verification.expiresAt && new Date() > verification.expiresAt;
      const currentStatus = isExpired
        ? VerificationStatus.EXPIRED
        : verification.status;

      // Update status if expired
      if (isExpired && verification.status === VerificationStatus.ACTIVE) {
        verification.status = VerificationStatus.EXPIRED;
        await verification.save();
      }

      // Only count active verifications
      if (currentStatus === VerificationStatus.ACTIVE) {
        const bonus = verification.multiplierBonus;
        totalMultiplierBonus *= bonus;

        if (bonus > highestBonus) {
          highestBonus = bonus;
          highestVerification = verification.provider;
        }
      }

      // Calculate days until expiry
      const daysUntilExpiry = verification.expiresAt
        ? Math.ceil(
            (verification.expiresAt.getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          )
        : undefined;

      verificationDetails.push({
        provider: verification.provider,
        providerName: PROVIDER_INFO[verification.provider].name,
        status: currentStatus,
        multiplierBonus: verification.multiplierBonus,
        verifiedAt: verification.verifiedAt,
        expiresAt: verification.expiresAt,
        attestationAddress: verification.attestationAddress,
        daysUntilExpiry,
      });
    }

    const isVerified = verificationDetails.some(
      (v) => v.status === VerificationStatus.ACTIVE,
    );

    return {
      walletAddress,
      isVerified,
      verifications: verificationDetails,
      totalMultiplierBonus: parseFloat(totalMultiplierBonus.toFixed(2)),
      highestVerification,
    };
  }

  /**
   * Refresh verification status from on-chain
   */
  async refreshVerificationFromChain(
    walletAddress: string,
    provider?: VerificationProvider,
  ): Promise<VerificationResultDto> {
    this.logger.log(
      `Refreshing verification for ${walletAddress} from on-chain...`,
    );

    try {
      // Check on-chain attestation
      const result = await this.checkOnChainAttestation(
        walletAddress,
        provider,
      );

      if (result.isVerified) {
        // Update or create verification record
        await this.updateVerificationRecord(walletAddress, result);
      }
    } catch (error) {
      this.logger.error(
        `Failed to refresh verification from chain: ${error.message}`,
      );
    }

    return this.checkVerificationStatus(walletAddress, provider);
  }

  /**
   * Check on-chain attestation using Solana blockchain
   */
  private async checkOnChainAttestation(
    walletAddress: string,
    provider?: VerificationProvider,
  ): Promise<OnChainVerificationResult> {
    this.logger.log(
      `Checking on-chain attestation for ${walletAddress} (provider: ${provider || 'auto-detect'})`,
    );

    try {
      // If provider specified, check that specific one
      if (provider) {
        return await this.solanaVerificationService.checkVerification(
          walletAddress,
          provider,
        );
      }

      // Otherwise, check all Civic Pass types and return the highest one found
      const providers = [
        VerificationProvider.CIVIC_UNIQUENESS, // Check highest tier first
        VerificationProvider.CIVIC_ID,
        VerificationProvider.CIVIC_LIVENESS,
        VerificationProvider.CIVIC_CAPTCHA,
      ];

      for (const providerType of providers) {
        const result = await this.solanaVerificationService.checkVerification(
          walletAddress,
          providerType,
        );

        if (result.isVerified) {
          this.logger.log(
            `Found active ${providerType} pass for ${walletAddress}`,
          );
          return result;
        }
      }

      // No active pass found
      this.logger.log(`No active Civic Pass found for ${walletAddress}`);
      return {
        isVerified: false,
        provider: VerificationProvider.CIVIC_LIVENESS,
        status: VerificationStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(
        `Failed to check on-chain attestation: ${error.message}`,
      );
      return {
        isVerified: false,
        provider: provider || VerificationProvider.CIVIC_LIVENESS,
        status: VerificationStatus.FAILED,
      };
    }
  }

  /**
   * Update verification record in database
   */
  private async updateVerificationRecord(
    walletAddress: string,
    result: OnChainVerificationResult,
  ): Promise<VerificationDocument> {
    const multiplierBonus = VERIFICATION_MULTIPLIERS[result.provider];

    const verification = await this.verificationModel.findOneAndUpdate(
      {
        walletAddress,
        provider: result.provider,
      },
      {
        walletAddress,
        provider: result.provider,
        status: result.status,
        attestationAddress: result.attestationAddress,
        credentialAddress: result.credentialAddress,
        schemaAddress: result.schemaAddress,
        verifiedAt: result.verifiedAt || new Date(),
        expiresAt: result.expiresAt,
        lastCheckedAt: new Date(),
        multiplierBonus,
        metadata: result.metadata,
      },
      { upsert: true, new: true },
    );

    this.logger.log(
      `Updated verification for ${walletAddress}: ${result.provider}`,
    );
    return verification;
  }

  /**
   * Manually add verification (admin only)
   */
  async addVerification(
    walletAddress: string,
    provider: VerificationProvider,
    expiresInDays?: number,
    attestationAddress?: string,
  ): Promise<VerificationDocument> {
    const multiplierBonus = VERIFICATION_MULTIPLIERS[provider];
    const verifiedAt = new Date();
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const verification = await this.verificationModel.create({
      walletAddress,
      provider,
      status: VerificationStatus.ACTIVE,
      attestationAddress,
      verifiedAt,
      expiresAt,
      lastCheckedAt: verifiedAt,
      multiplierBonus,
    });

    this.logger.log(
      `Manually added verification for ${walletAddress}: ${provider}`,
    );
    return verification;
  }

  /**
   * Revoke verification (admin only)
   */
  async revokeVerification(
    walletAddress: string,
    provider: VerificationProvider,
    revokedBy: string,
    reason?: string,
  ): Promise<VerificationDocument> {
    const verification = await this.verificationModel.findOneAndUpdate(
      { walletAddress, provider },
      {
        status: VerificationStatus.REVOKED,
        revokedBy,
        revocationReason: reason,
        revokedAt: new Date(),
      },
      { new: true },
    );

    if (!verification) {
      throw new NotFoundException(
        `Verification not found for ${walletAddress} with provider ${provider}`,
      );
    }

    this.logger.log(
      `Revoked verification for ${walletAddress}: ${provider} by ${revokedBy}`,
    );
    return verification;
  }

  /**
   * Get list of available providers
   */
  async getProviders(): Promise<ProviderListDto[]> {
    return Object.values(VerificationProvider).map((provider) => ({
      provider,
      name: PROVIDER_INFO[provider].name,
      description: PROVIDER_INFO[provider].description,
      multiplierBonus: VERIFICATION_MULTIPLIERS[provider],
      enabled: true, // TODO: Make this configurable
    }));
  }

  /**
   * Get verification multiplier for reputation calculation
   */
  async getVerificationMultiplier(walletAddress: string): Promise<number> {
    const result = await this.checkVerificationStatus(walletAddress);
    return result.totalMultiplierBonus;
  }

  /**
   * Get all verifications (admin only)
   */
  async getAllVerifications(
    status?: VerificationStatus,
    provider?: VerificationProvider,
    page = 1,
    limit = 50,
  ): Promise<{ verifications: VerificationDocument[]; total: number }> {
    const query: any = {};
    if (status) query.status = status;
    if (provider) query.provider = provider;

    const [verifications, total] = await Promise.all([
      this.verificationModel
        .find(query)
        .sort({ verifiedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.verificationModel.countDocuments(query),
    ]);

    return { verifications, total };
  }

  /**
   * Get verification statistics
   */
  async getStats(): Promise<{
    totalVerifications: number;
    activeVerifications: number;
    expiredVerifications: number;
    byProvider: Record<VerificationProvider, number>;
  }> {
    const [total, active, expired] = await Promise.all([
      this.verificationModel.countDocuments(),
      this.verificationModel.countDocuments({
        status: VerificationStatus.ACTIVE,
      }),
      this.verificationModel.countDocuments({
        status: VerificationStatus.EXPIRED,
      }),
    ]);

    // Count by provider
    const byProvider = {} as Record<VerificationProvider, number>;
    for (const provider of Object.values(VerificationProvider)) {
      byProvider[provider] = await this.verificationModel.countDocuments({
        provider,
        status: VerificationStatus.ACTIVE,
      });
    }

    return {
      totalVerifications: total,
      activeVerifications: active,
      expiredVerifications: expired,
      byProvider,
    };
  }
}
