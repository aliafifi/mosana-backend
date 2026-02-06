import { Model } from 'mongoose';
import { Reputation, ReputationDocument } from './schemas/reputation.schema';
import { ApplyPenaltyDto } from './dto/penalty.dto';
import { VerificationService } from '../verification/verification.service';
export declare class ReputationService {
    private reputationModel;
    private verificationService;
    private readonly logger;
    constructor(reputationModel: Model<ReputationDocument>, verificationService: VerificationService);
    calculateReputation(walletAddress: string): Promise<ReputationDocument>;
    getReputation(walletAddress: string): Promise<any>;
    calculateRewardMultiplier(walletAddress: string): Promise<number>;
    updateMetrics(walletAddress: string, updates: Partial<Reputation['metrics']>): Promise<void>;
    applyPenalty(penaltyDto: ApplyPenaltyDto, adminWallet: string): Promise<ReputationDocument>;
    getLeaderboard(limit?: number): Promise<ReputationDocument[]>;
    getPlatformStats(): Promise<{
        totalUsers: number;
        flaggedUsers: number;
        levelDistribution: any[];
        averageScore: any;
    }>;
}
