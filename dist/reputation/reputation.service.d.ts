import { Model } from 'mongoose';
import { Reputation, ReputationDocument } from './schemas/reputation.schema';
import { ApplyPenaltyDto } from './dto/penalty.dto';
export declare class ReputationService {
    private reputationModel;
    constructor(reputationModel: Model<ReputationDocument>);
    calculateReputation(walletAddress: string): Promise<ReputationDocument>;
    getReputation(walletAddress: string): Promise<ReputationDocument>;
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
