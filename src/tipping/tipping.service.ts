import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey } from '@solana/web3.js';
import { Tip, TipDocument } from './tip.schema';
import { CreateTipDto } from './dto/create-tip.dto';
import { TIPPING_CONFIG } from './tipping.config';
import { ReputationService } from '../reputation/reputation.service';

@Injectable()
export class TippingService {
  private readonly logger = new Logger(TippingService.name);
  private solanaConnection: Connection;

  constructor(
    @InjectModel(Tip.name) private tipModel: Model<TipDocument>,
    private configService: ConfigService,
    private reputationService: ReputationService,
  ) {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL');
    this.solanaConnection = new Connection(rpcUrl || 'https://api.devnet.solana.com');
  }

  // Create a tip
  async createTip(
    fromWallet: string,
    createTipDto: CreateTipDto,
  ): Promise<Tip> {
    const { toWallet, amount, currency, postId, commentId, message } = createTipDto;

    // SECURITY: Cannot tip yourself
    if (fromWallet === toWallet) {
      throw new BadRequestException('You cannot tip yourself');
    }

    // Validate tip amount
    const validation = TIPPING_CONFIG.isValidTipAmount(amount);
    if (!validation.valid) {
      throw new BadRequestException(validation.error);
    }

    // Calculate fees using our sexy tiered model 🔥
    const { totalFee, burned, toRewards, feePercentage } = TIPPING_CONFIG.calculateFee(amount);

    this.logger.log(
      `Tip: ${amount} ${currency} | Fee: ${totalFee} (${feePercentage}%) | Burned: ${burned} 🔥 | Rewards: ${toRewards}`,
    );

    // Send the tip (blockchain transaction)
    const txSignature = await this.sendTipTransaction(
      fromWallet,
      toWallet,
      amount,
      currency,
    );

    // Record the tip in database
    const tip = await this.tipModel.create({
      fromWallet,
      toWallet,
      amount,
      currency,
      platformFee: totalFee,
      feePercentage,
      amountBurned: burned,
      amountToRewards: toRewards,
      transactionSignature: txSignature,
      ...(postId && { postId }),
      ...(commentId && { commentId }),
      ...(message && { message }),
      status: 'completed',
      tippedAt: new Date(),
    });

    // Update reputation: sender sent a tip
    try {
      await this.reputationService.updateMetrics(fromWallet, {
        tipsSent: amount,
      });
    } catch (error) {
      // Silently fail - don't block tipping if reputation update fails
      this.logger.warn(`Reputation update failed for sender ${fromWallet}: ${error.message}`);
    }

    // Update reputation: receiver got a tip
    try {
      await this.reputationService.updateMetrics(toWallet, {
        tipsReceived: amount,
      });
    } catch (error) {
      // Silently fail - don't block tipping if reputation update fails
      this.logger.warn(`Reputation update failed for receiver ${toWallet}: ${error.message}`);
    }

    // TODO: Actually burn tokens (implement token burn function)
    // TODO: Add toRewards to daily rewards pool

    return tip;
  }

  // Get tips sent by user
  async getSentTips(
    walletAddress: string,
    page: number = 1,
    limit: number = 30,
  ) {
    const skip = (page - 1) * limit;

    const tips = await this.tipModel
      .find({ fromWallet: walletAddress })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalSent = await this.tipModel
      .aggregate([
        { $match: { fromWallet: walletAddress } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();

    return {
      totalSent: totalSent[0]?.total || 0,
      tips,
    };
  }

  // Get tips received by user
  async getReceivedTips(
    walletAddress: string,
    page: number = 1,
    limit: number = 30,
  ) {
    const skip = (page - 1) * limit;

    const tips = await this.tipModel
      .find({ toWallet: walletAddress })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalReceived = await this.tipModel
      .aggregate([
        { $match: { toWallet: walletAddress } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();

    return {
      totalReceived: totalReceived[0]?.total || 0,
      tips,
    };
  }

  // Get tips on a specific post
  async getPostTips(postId: string) {
    const tips = await this.tipModel
      .find({ postId, status: 'completed' })
      .sort({ createdAt: -1 })
      .exec();

    const totalTipped = tips.reduce((sum, tip) => sum + tip.amount, 0);

    return {
      totalTipped,
      tipsCount: tips.length,
      tips,
    };
  }

  // Get user-specific tipping statistics
  async getUserStats(walletAddress: string) {
    const [sentStats, receivedStats] = await Promise.all([
      // Stats for tips sent by user
      this.tipModel.aggregate([
        { $match: { fromWallet: walletAddress } },
        {
          $group: {
            _id: null,
            totalSent: { $sum: '$amount' },
            totalFeesPaid: { $sum: '$platformFee' },
            tipsGiven: { $sum: 1 },
          },
        },
      ]),
      // Stats for tips received by user
      this.tipModel.aggregate([
        { $match: { toWallet: walletAddress } },
        {
          $group: {
            _id: null,
            totalReceived: { $sum: '$amount' },
            tipsReceived: { $sum: 1 },
          },
        },
      ]),
    ]);

    const sent = sentStats[0] || {
      totalSent: 0,
      totalFeesPaid: 0,
      tipsGiven: 0,
    };

    const received = receivedStats[0] || {
      totalReceived: 0,
      tipsReceived: 0,
    };

    return {
      walletAddress,
      sent,
      received,
      netBalance: received.totalReceived - sent.totalSent,
    };
  }

  // Get platform statistics (for analytics/transparency)
  async getPlatformStats() {
    const stats = await this.tipModel.aggregate([
      {
        $group: {
          _id: null,
          totalTips: { $sum: '$amount' },
          totalFees: { $sum: '$platformFee' },
          totalBurned: { $sum: '$amountBurned' },
          totalToRewards: { $sum: '$amountToRewards' },
          tipsCount: { $sum: 1 },
        },
      },
    ]);

    return stats[0] || {
      totalTips: 0,
      totalFees: 0,
      totalBurned: 0,
      totalToRewards: 0,
      tipsCount: 0,
    };
  }

  // Calculate fee preview (for UI before tipping)
  calculateFeePreview(amount: number) {
    const validation = TIPPING_CONFIG.isValidTipAmount(amount);
    
    if (!validation.valid) {
      return {
        valid: false,
        error: validation.error,
      };
    }

    const { totalFee, burned, toRewards, feePercentage } = TIPPING_CONFIG.calculateFee(amount);
    const recipientReceives = amount - totalFee;

    return {
      valid: true,
      amount,
      recipientReceives,
      fee: {
        total: totalFee,
        percentage: feePercentage,
        burned,
        toRewards,
      },
      tier: TIPPING_CONFIG.getTierName(amount),
    };
  }

  // Send tip transaction (Placeholder - will implement SPL token transfer)
  private async sendTipTransaction(
    fromWallet: string,
    toWallet: string,
    amount: number,
    currency: string,
  ): Promise<string> {
    // FOR DEVNET TESTING: Mock transaction
    this.logger.log(
      `[MOCK] Sending ${amount} ${currency} from ${fromWallet} to ${toWallet}`,
    );

    // Generate mock transaction signature
    const mockSignature = `tip_tx_${Date.now()}_${fromWallet.slice(0, 8)}`;

    // TODO: Implement actual SPL token transfer:
    // 1. User signs transaction in Flutter app
    // 2. App sends signed transaction to backend
    // 3. Backend verifies and broadcasts to Solana
    // 4. Return actual transaction signature

    return mockSignature;
  }
}
