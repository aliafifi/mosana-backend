import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
import bs58 from 'bs58';
import {
  VerificationProvider,
  VerificationStatus,
} from '../schemas/verification.schema';
import { OnChainVerificationResult } from '../interfaces/verification-provider.interface';

// Known Civic Pass program IDs and addresses
const CIVIC_GATEKEEPER_NETWORK = {
  // Civic Pass Gatekeeper Networks (mainnet)
  CAPTCHA: new PublicKey('ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'),
  LIVENESS: new PublicKey('bni1ewus6aMxTxBi5SAfzEmmXLf8KcVFRmTfproJuKw'),
  UNIQUENESS: new PublicKey('uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv'),
  ID_VERIFICATION: new PublicKey('civic1Gbs7Z2sJuLKqGUFXLnLEfYqAL7chKDFLLKdH6'),
};

@Injectable()
export class SolanaVerificationService {
  private readonly logger = new Logger(SolanaVerificationService.name);
  private connection: Connection;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>(
      'SOLANA_RPC_URL',
      'https://api.mainnet-beta.solana.com',
    );
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  /**
   * Check if a wallet has a valid Civic Pass on-chain
   */
  async checkCivicPass(
    walletAddress: string,
    provider: VerificationProvider,
  ): Promise<OnChainVerificationResult> {
    try {
      // Get the appropriate gatekeeper network
      const gatekeeperNetwork = this.getGatekeeperNetwork(provider);
      if (!gatekeeperNetwork) {
        this.logger.warn(
          `No gatekeeper network found for provider: ${provider}`,
        );
        return {
          isVerified: false,
          provider,
          status: VerificationStatus.FAILED,
        };
      }

      // Derive the Gateway Token (Civic Pass) PDA
      const walletPubkey = new PublicKey(walletAddress);
      const [gatewayTokenPDA] = await this.deriveGatewayTokenPDA(
        walletPubkey,
        gatekeeperNetwork,
      );

      // Fetch the account
      const accountInfo = await this.connection.getAccountInfo(gatewayTokenPDA);

      if (!accountInfo) {
        // No Civic Pass found
        return {
          isVerified: false,
          provider,
          status: VerificationStatus.PENDING,
          attestationAddress: gatewayTokenPDA.toBase58(),
        };
      }

      // Parse the Gateway Token data
      const gatewayToken = this.parseGatewayToken(accountInfo.data);

      // Check if it's active and not expired
      const now = Math.floor(Date.now() / 1000);
      const isActive = gatewayToken.state === 1; // 1 = Active
      const isExpired = gatewayToken.expiryTime > 0 && gatewayToken.expiryTime < now;

      if (isActive && !isExpired) {
        // Valid Civic Pass
        return {
          isVerified: true,
          provider,
          status: VerificationStatus.ACTIVE,
          attestationAddress: gatewayTokenPDA.toBase58(),
          verifiedAt: new Date(gatewayToken.issuedAt * 1000),
          expiresAt:
            gatewayToken.expiryTime > 0
              ? new Date(gatewayToken.expiryTime * 1000)
              : undefined,
          metadata: {
            state: gatewayToken.state,
            gatekeeperNetwork: gatekeeperNetwork.toBase58(),
          },
        };
      } else if (isExpired) {
        // Expired Civic Pass
        return {
          isVerified: false,
          provider,
          status: VerificationStatus.EXPIRED,
          attestationAddress: gatewayTokenPDA.toBase58(),
          expiresAt: new Date(gatewayToken.expiryTime * 1000),
        };
      } else {
        // Inactive or revoked
        return {
          isVerified: false,
          provider,
          status: VerificationStatus.REVOKED,
          attestationAddress: gatewayTokenPDA.toBase58(),
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to check Civic Pass for ${walletAddress}: ${error.message}`,
      );
      return {
        isVerified: false,
        provider,
        status: VerificationStatus.FAILED,
      };
    }
  }

  /**
   * Derive the Gateway Token PDA (Program Derived Address)
   */
  private async deriveGatewayTokenPDA(
    walletPubkey: PublicKey,
    gatekeeperNetwork: PublicKey,
  ): Promise<[PublicKey, number]> {
    const CIVIC_GATEWAY_PROGRAM_ID = new PublicKey(
      'gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs',
    );

    return PublicKey.findProgramAddressSync(
      [
        walletPubkey.toBuffer(),
        Buffer.from('gateway'),
        Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]), // seed
        gatekeeperNetwork.toBuffer(),
      ],
      CIVIC_GATEWAY_PROGRAM_ID,
    );
  }

  /**
   * Parse Gateway Token account data (simplified)
   */
  private parseGatewayToken(data: Buffer): {
    state: number;
    issuedAt: number;
    expiryTime: number;
  } {
    // Simplified parsing - Civic Pass account structure:
    // [0-7]: discriminator
    // [8-39]: owner (pubkey)
    // [40-71]: gatekeeper_network (pubkey)
    // [72-103]: gatekeeper (pubkey)
    // [104]: state (1 byte: 0=Frozen, 1=Active, 2=Revoked)
    // [105-112]: issued_at (i64)
    // [113-120]: expiry_time (i64, 0 = no expiry)

    try {
      const state = data.readUInt8(104);
      const issuedAt = Number(data.readBigInt64LE(105));
      const expiryTime = Number(data.readBigInt64LE(113));

      return {
        state,
        issuedAt,
        expiryTime,
      };
    } catch (error) {
      this.logger.error(`Failed to parse Gateway Token: ${error.message}`);
      return {
        state: 0,
        issuedAt: 0,
        expiryTime: 0,
      };
    }
  }

  /**
   * Get the gatekeeper network for a provider
   */
  private getGatekeeperNetwork(
    provider: VerificationProvider,
  ): PublicKey | null {
    switch (provider) {
      case VerificationProvider.CIVIC_CAPTCHA:
        return CIVIC_GATEKEEPER_NETWORK.CAPTCHA;
      case VerificationProvider.CIVIC_LIVENESS:
        return CIVIC_GATEKEEPER_NETWORK.LIVENESS;
      case VerificationProvider.CIVIC_UNIQUENESS:
        return CIVIC_GATEKEEPER_NETWORK.UNIQUENESS;
      case VerificationProvider.CIVIC_ID:
        return CIVIC_GATEKEEPER_NETWORK.ID_VERIFICATION;
      default:
        return null;
    }
  }

  /**
   * Check verification for any supported provider
   */
  async checkVerification(
    walletAddress: string,
    provider: VerificationProvider,
  ): Promise<OnChainVerificationResult> {
    // For now, only Civic Pass is supported
    if (
      provider === VerificationProvider.CIVIC_CAPTCHA ||
      provider === VerificationProvider.CIVIC_LIVENESS ||
      provider === VerificationProvider.CIVIC_UNIQUENESS ||
      provider === VerificationProvider.CIVIC_ID
    ) {
      return this.checkCivicPass(walletAddress, provider);
    }

    // Other providers not yet implemented
    this.logger.warn(`Provider ${provider} not yet supported for on-chain checking`);
    return {
      isVerified: false,
      provider,
      status: VerificationStatus.PENDING,
    };
  }
}
