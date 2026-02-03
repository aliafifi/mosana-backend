import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { DailyEngagement, DailyEngagementDocument } from './reward.schema';
import { Reward, RewardDocument } from './reward.schema';
import { TOKENOMICS } from './rewards.config';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);
  private solanaConnection: Connection;

  constructor(
    @InjectModel(DailyEngagement.name)
    private dailyEngagementModel: Model<DailyEngagementDocument>,
    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,
    private configService: ConfigService,
  ) {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL');
    this.solanaConnection = new Connection(rpcUrl || 'https://api.devnet.solana.com');
  }

  // Track engagement when user performs actions
  async trackEngagement(
    walletAddress: string,
    action: 'post' | 'likeReceived' | 'commentReceived' | 'view' | 'likeGiven' | 'commentGiven',
  ): Promise<void> {
    const today = this.getToday();

    // Find or create today's engagement record
    let engagement = await this.dailyEngagementModel.findOne({
      walletAddress,
      date: today,
    });

    if (!engagement) {
      engagement = await this.dailyEngagementModel.create({
        walletAddress,
        date: today,
        postsCreated: 0,
        likesReceived: 0,
        commentsReceived: 0,
        viewsReceived: 0,
        likesGiven: 0,
        commentsGiven: 0,
        totalPoints: 0,
        tokensEarned: 0,
        isDistributed: false,
      });
    }

    // Increment the appropriate counter
    switch (action) {
      case 'post':
        engagement.postsCreated += 1;
        break;
      case 'likeReceived':
        engagement.likesReceived += 1;
        break;
      case 'commentReceived':
        engagement.commentsReceived += 1;
        break;
      case 'view':
        engagement.viewsReceived += 1;
        break;
      case 'likeGiven':
        engagement.likesGiven += 1;
        break;
      case 'commentGiven':
        engagement.commentsGiven += 1;
        break;
    }

    // Recalculate total points
    engagement.totalPoints = TOKENOMICS.calculatePoints({
      postsCreated: engagement.postsCreated,
      likesReceived: engagement.likesReceived,
      commentsReceived: engagement.commentsReceived,
      viewsReceived: engagement.viewsReceived,
      likesGiven: engagement.likesGiven,
      commentsGiven: engagement.commentsGiven,
    });

    // Apply maximum points cap (anti-gaming)
    if (engagement.totalPoints > TOKENOMICS.MAX_POINTS_PER_DAY) {
      engagement.totalPoints = TOKENOMICS.MAX_POINTS_PER_DAY;
    }

    await engagement.save();
  }

  // Get user's today's engagement
  async getTodayEngagement(walletAddress: string) {
    const today = this.getToday();

    const engagement = await this.dailyEngagementModel.findOne({
      walletAddress,
      date: today,
    });

    if (!engagement) {
      return {
        date: today,
        postsCreated: 0,
        likesReceived: 0,
        commentsReceived: 0,
        viewsReceived: 0,
        likesGiven: 0,
        commentsGiven: 0,
        totalPoints: 0,
        estimatedTokens: 0,
      };
    }

    // Calculate rough estimate (actual depends on total platform activity)
    const currentYear = new Date().getFullYear();
    const dailyPool = TOKENOMICS.getDailyPool(currentYear);
    const estimatedTokens = Math.floor(dailyPool * 0.01); // Very rough estimate

    return {
      date: engagement.date,
      postsCreated: engagement.postsCreated,
      likesReceived: engagement.likesReceived,
      commentsReceived: engagement.commentsReceived,
      viewsReceived: engagement.viewsReceived,
      likesGiven: engagement.likesGiven,
      commentsGiven: engagement.commentsGiven,
      totalPoints: engagement.totalPoints,
      estimatedTokens,
    };
  }

  // Get user's rewards history
  async getRewardsHistory(walletAddress: string, page: number = 1, limit: number = 30) {
    const skip = (page - 1) * limit;

    const rewards = await this.rewardModel
      .find({ walletAddress })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalEarned = await this.rewardModel
      .aggregate([
        { $match: { walletAddress } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();

    return {
      totalEarned: totalEarned[0]?.total || 0,
      history: rewards,
    };
  }

  // CRON JOB: Daily distribution at midnight UTC
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async distributeDaily() {
    this.logger.log('Starting daily reward distribution...');

    try {
      const yesterday = this.getYesterday();
      const currentYear = new Date().getFullYear();
      const dailyPool = TOKENOMICS.getDailyPool(currentYear);

      // Get all undistributed engagement from yesterday
      const engagements = await this.dailyEngagementModel.find({
        date: yesterday,
        isDistributed: false,
        totalPoints: { $gte: TOKENOMICS.MINIMUM_POINTS_FOR_REWARD },
      });

      if (engagements.length === 0) {
        this.logger.log('No eligible users for distribution');
        return;
      }

      // Calculate total points
      const totalPoints = engagements.reduce((sum, e) => sum + e.totalPoints, 0);

      this.logger.log(`Total points: ${totalPoints}, Daily pool: ${dailyPool}`);

      // Distribute to each user proportionally
      for (const engagement of engagements) {
        const userShare = engagement.totalPoints / totalPoints;
        const tokensEarned = Math.floor(dailyPool * userShare);

        // Skip if less than 1 token
        if (tokensEarned < 1) {
          continue;
        }

        try {
          // DEVNET: Log instead of actual transfer for now
          const txSignature = await this.sendTokens(
            engagement.walletAddress,
            tokensEarned,
          );

          // Record reward in history
          await this.rewardModel.create({
            walletAddress: engagement.walletAddress,
            amount: tokensEarned,
            date: yesterday,
            engagementPoints: engagement.totalPoints,
            transactionSignature: txSignature,
            status: 'completed',
          });

          // Update engagement record
          engagement.tokensEarned = tokensEarned;
          engagement.isDistributed = true;
          await engagement.save();

          this.logger.log(
            `Distributed ${tokensEarned} tokens to ${engagement.walletAddress}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to distribute to ${engagement.walletAddress}: ${error.message}`,
          );
          
          // Record failed attempt
          await this.rewardModel.create({
            walletAddress: engagement.walletAddress,
            amount: tokensEarned,
            date: yesterday,
            engagementPoints: engagement.totalPoints,
            transactionSignature: 'failed',
            status: 'failed',
          });
        }
      }

      this.logger.log('Daily distribution completed successfully');
    } catch (error) {
      this.logger.error(`Distribution failed: ${error.message}`);
    }
  }

  // Send tokens to user (Placeholder for now - will implement SPL token transfer)
  private async sendTokens(
    recipientAddress: string,
    amount: number,
  ): Promise<string> {
    // FOR DEVNET TESTING: Just return a mock transaction signature
    // In production, this will use SPL Token transfers
    
    this.logger.log(`[MOCK] Sending ${amount} tokens to ${recipientAddress}`);
    
    // Generate mock transaction signature
    const mockSignature = `mock_tx_${Date.now()}_${recipientAddress.slice(0, 8)}`;
    
    // TODO: Implement actual SPL token transfer:
    // 1. Load treasury wallet keypair from secure storage
    // 2. Create SPL token transfer instruction
    // 3. Sign and send transaction
    // 4. Return actual transaction signature
    
    return mockSignature;
  }

  // Helper: Get today's date (YYYY-MM-DD)
  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // Helper: Get yesterday's date (YYYY-MM-DD)
  private getYesterday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  }
}
