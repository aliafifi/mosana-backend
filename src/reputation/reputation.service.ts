import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reputation, ReputationDocument } from './schemas/reputation.schema';
import { 
  DEFAULT_SCORING_CONFIG, 
  PENALTY_PRESETS,
  AVAILABLE_BADGES,
} from './interfaces/scoring.interface';
import { ApplyPenaltyDto } from './dto/penalty.dto';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class ReputationService {
  private readonly logger = new Logger(ReputationService.name);

  constructor(
    @InjectModel(Reputation.name)
    private reputationModel: Model<ReputationDocument>,
    private verificationService: VerificationService,
  ) {}

  // ============================================
  // MAIN CALCULATION METHOD
  // This is the core function that calculates reputation
  // ============================================
  
  async calculateReputation(walletAddress: string): Promise<ReputationDocument> {
    // Find or create reputation record
    let reputation = await this.reputationModel.findOne({ walletAddress });
    
    if (!reputation) {
      // First time calculating - create new record
      reputation = new this.reputationModel({
        walletAddress,
        firstActivity: new Date(),
      });
    }

    // TODO: In next phase, we'll fetch real data from other modules
    // For now, we'll use the metrics already stored in the reputation document
    const metrics = reputation.metrics;

    // Initialize score breakdown
    const breakdown = {
      accountAge: { points: 0, maxPoints: 100 },
      engagement: { points: 0, maxPoints: 250 },
      economic: { points: 0, maxPoints: 200 },
      socialGood: { points: 0, maxPoints: 150 },
      dao: { points: 0, maxPoints: 100 },
      nft: { points: 0, maxPoints: 100 },
      trust: { points: 0, maxPoints: 100 },
    };

    // ============================================
    // 1. ACCOUNT AGE SCORE
    // ============================================
    const accountAgeDays = Math.floor(
      (Date.now() - reputation.firstActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    breakdown.accountAge.points = Math.min(
      (accountAgeDays / DEFAULT_SCORING_CONFIG.accountAge.daysForMaxScore) * 
      DEFAULT_SCORING_CONFIG.accountAge.maxPoints,
      DEFAULT_SCORING_CONFIG.accountAge.maxPoints
    );

    // ============================================
    // 2. ENGAGEMENT SCORE
    // ============================================
    let engagementPoints = 0;
    engagementPoints += metrics.totalPosts * DEFAULT_SCORING_CONFIG.engagement.pointsPerPost;
    engagementPoints += metrics.totalLikes * DEFAULT_SCORING_CONFIG.engagement.pointsPerLike;
    engagementPoints += metrics.totalComments * DEFAULT_SCORING_CONFIG.engagement.pointsPerComment;
    
    breakdown.engagement.points = Math.min(
      engagementPoints,
      DEFAULT_SCORING_CONFIG.engagement.maxPoints
    );

    // Spam detection: If too many posts in short time, flag account
    if (accountAgeDays < 7 && metrics.totalPosts > DEFAULT_SCORING_CONFIG.engagement.spamThreshold) {
      reputation.isFlagged = true;
      reputation.flagReason = 'rapid_posting_new_account';
    }

    // ============================================
    // 3. ECONOMIC SCORE (Tips)
    // ============================================
    const economicPoints = 
      metrics.tipsReceived / DEFAULT_SCORING_CONFIG.economic.mosanaPerPoint;
    
    breakdown.economic.points = Math.min(
      economicPoints,
      DEFAULT_SCORING_CONFIG.economic.maxPoints
    );

    // ============================================
    // 4. SOCIAL GOOD SCORE (Charity)
    // ============================================
    let socialGoodPoints = 
      metrics.charityDonations / DEFAULT_SCORING_CONFIG.socialGood.mosanaPerPoint;
    
    // Bonus for consistent giving (if we had donation history, we'd check frequency)
    // For now, simple check: if donated a lot, assume consistency
    if (metrics.charityDonations >= DEFAULT_SCORING_CONFIG.socialGood.minimumForBonus * 1000) {
      socialGoodPoints += DEFAULT_SCORING_CONFIG.socialGood.consistencyBonus;
    }
    
    breakdown.socialGood.points = Math.min(
      socialGoodPoints,
      DEFAULT_SCORING_CONFIG.socialGood.maxPoints
    );

    // Penalty: No charity after 90 days
    if (accountAgeDays > 90 && metrics.charityDonations === 0) {
      reputation.penalties.push({
        reason: 'zero_charity_90days',
        points: PENALTY_PRESETS.zero_charity_90days,
        date: new Date(),
      });
    }

    // ============================================
    // 5. DAO SCORE
    // ============================================
    let daoPoints = 0;
    daoPoints += metrics.daosJoined * DEFAULT_SCORING_CONFIG.dao.pointsPerDao;
    daoPoints += metrics.proposalsCreated * DEFAULT_SCORING_CONFIG.dao.pointsPerProposal;
    daoPoints += metrics.votesCast * DEFAULT_SCORING_CONFIG.dao.pointsPerVote;
    
    breakdown.dao.points = Math.min(
      daoPoints,
      DEFAULT_SCORING_CONFIG.dao.maxPoints
    );

    // ============================================
    // 6. NFT SCORE
    // ============================================
    let nftPoints = 0;
    nftPoints += metrics.nftsMinted * DEFAULT_SCORING_CONFIG.nft.pointsPerMint;
    nftPoints += metrics.nftsSold * DEFAULT_SCORING_CONFIG.nft.pointsPerSale;
    nftPoints += metrics.nftRevenue / DEFAULT_SCORING_CONFIG.nft.revenuePerPoint;
    
    breakdown.nft.points = Math.min(
      nftPoints,
      DEFAULT_SCORING_CONFIG.nft.maxPoints
    );

    // ============================================
    // 7. TRUST SCORE (Weighted tips from high-rep users)
    // ============================================
    // TODO: This requires checking who tipped the user and their reputation
    // For now, set to 0 (we'll implement in Phase 2)
    breakdown.trust.points = 0;

    // ============================================
    // 8. CALCULATE TOTAL SCORE
    // ============================================
    let totalScore = 
      breakdown.accountAge.points +
      breakdown.engagement.points +
      breakdown.economic.points +
      breakdown.socialGood.points +
      breakdown.dao.points +
      breakdown.nft.points +
      breakdown.trust.points;

    // Subtract penalties
    const totalPenalties = reputation.penalties.reduce((sum, p) => sum + p.points, 0);
    totalScore += totalPenalties; // penalties are negative, so this subtracts

    // Ensure score is between 0-1000
    totalScore = Math.max(0, Math.min(1000, totalScore));

    // ============================================
    // 9. DETERMINE LEVEL & MULTIPLIER
    // ============================================
    let level = 'New';
    let rewardMultiplier = 1.0;

    if (totalScore >= 751) {
      level = 'Legend';
      rewardMultiplier = 3.0;
    } else if (totalScore >= 501) {
      level = 'Veteran';
      rewardMultiplier = 2.0;
    } else if (totalScore >= 301) {
      level = 'Trusted';
      rewardMultiplier = 1.5;
    } else if (totalScore >= 101) {
      level = 'Active';
      rewardMultiplier = 1.2;
    }

    // ============================================
    // 10. AWARD BADGES
    // ============================================
    const badges: string[] = [];

    // Early Adopter (joined before March 1, 2026)
    if (reputation.firstActivity < new Date('2026-03-01')) {
      badges.push('early_adopter');
    }

    // Charity Champion (10,000+ MOSANA donated)
    if (metrics.charityDonations >= 10000) {
      badges.push('charity_champion');
    }

    // DAO Leader (3+ proposals)
    if (metrics.proposalsCreated >= 3) {
      badges.push('dao_leader');
    }

    // NFT Artist (10+ NFTs minted)
    if (metrics.nftsMinted >= 10) {
      badges.push('nft_artist');
    }

    // Community Pillar (50,000+ MOSANA tips received)
    if (metrics.tipsReceived >= 50000) {
      badges.push('community_pillar');
    }

    // Legend badge
    if (level === 'Legend') {
      badges.push('legend');
    }

    // ============================================
    // 11. UPDATE & SAVE
    // ============================================
    reputation.totalScore = totalScore;
    reputation.level = level;
    reputation.rewardMultiplier = rewardMultiplier;
    reputation.breakdown = breakdown;
    reputation.badges = badges;
    reputation.lastCalculated = new Date();
    reputation.calculationCount += 1;

    await reputation.save();

    return reputation;
  }

  // ============================================
  // GET REPUTATION BY WALLET (with verification bonus)
  // ============================================
   
  async getReputation(walletAddress: string): Promise<any> {
    let reputation: ReputationDocument | null = await this.reputationModel.findOne({ walletAddress });
  
    if (!reputation) {
      // Auto-create on first lookup
      reputation = await this.calculateReputation(walletAddress);
    }

    // At this point, reputation is definitely not null
    const reputationObj = reputation.toObject();

    // Add verification multiplier to response
    let verificationMultiplier = 1.0;
    let verificationStatus: any = null;
    try {
      const status = await this.verificationService.checkVerificationStatus(walletAddress);
      verificationStatus = status;
      verificationMultiplier = status.totalMultiplierBonus;
    } catch (error) {
      this.logger.warn(`Failed to get verification multiplier for ${walletAddress}: ${error.message}`);
    }

    // Calculate total multiplier including verification
    const baseMultiplier = reputation.rewardMultiplier || 1.0;
    const totalMultiplier = Math.min(
      baseMultiplier * verificationMultiplier, 
      5.0
    );
  
    return {
      ...reputationObj,
      verificationMultiplier,
      totalMultiplier,
      verificationStatus: verificationStatus || undefined,
    };
  }

  // ============================================
  // CALCULATE REWARD MULTIPLIER (used by Rewards module)
  // ============================================

  async calculateRewardMultiplier(walletAddress: string): Promise<number> {
    const reputationData = await this.getReputation(walletAddress);
    
    // Return the total multiplier (includes verification bonus)
    return reputationData.totalMultiplier || 1.0;
  }

  // ============================================
  // UPDATE METRICS (Called by other modules)
  // ============================================
  
  async updateMetrics(
    walletAddress: string,
    updates: Partial<Reputation['metrics']>
  ): Promise<void> {
    let reputation: ReputationDocument | null = await this.reputationModel.findOne({ walletAddress });
    
    if (!reputation) {
      reputation = new this.reputationModel({
        walletAddress,
        firstActivity: new Date(),
      });
    }

    // Merge updates into existing metrics
    Object.keys(updates).forEach(key => {
      if (reputation) {
        reputation.metrics[key] = (reputation.metrics[key] || 0) + updates[key];
      }
    });

    if (reputation) {
      await reputation.save();
      // Recalculate reputation after metrics update
      await this.calculateReputation(walletAddress);
    }
  }

  // ============================================
  // APPLY PENALTY (Admin only)
  // ============================================
  
  async applyPenalty(
    penaltyDto: ApplyPenaltyDto,
    adminWallet: string
  ): Promise<ReputationDocument> {
    const reputation = await this.reputationModel.findOne({ 
      walletAddress: penaltyDto.walletAddress 
    });

    if (!reputation) {
      throw new NotFoundException('Reputation not found');
    }

    reputation.penalties.push({
      reason: penaltyDto.reason,
      points: penaltyDto.points,
      date: new Date(),
      adminWallet,
      details: penaltyDto.details,
    });

    await reputation.save();

    // Recalculate after penalty
    return this.calculateReputation(penaltyDto.walletAddress);
  }

  // ============================================
  // LEADERBOARD
  // ============================================
  
  async getLeaderboard(limit: number = 100): Promise<ReputationDocument[]> {
    return this.reputationModel
      .find({ isFlagged: false })
      .sort({ totalScore: -1 })
      .limit(limit)
      .exec();
  }

  // ============================================
  // PLATFORM STATS
  // ============================================
  
  async getPlatformStats() {
    const totalUsers = await this.reputationModel.countDocuments();
    const flaggedUsers = await this.reputationModel.countDocuments({ isFlagged: true });

    const levelCounts = await this.reputationModel.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    const avgScore = await this.reputationModel.aggregate([
      { $group: { _id: null, avg: { $avg: '$totalScore' } } }
    ]);

    return {
      totalUsers,
      flaggedUsers,
      levelDistribution: levelCounts,
      averageScore: avgScore[0]?.avg || 0,
    };
  }
}
