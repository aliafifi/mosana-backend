import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { DailyEngagementDocument } from './reward.schema';
import { Reward, RewardDocument } from './reward.schema';
export declare class RewardsService {
    private dailyEngagementModel;
    private rewardModel;
    private configService;
    private readonly logger;
    private solanaConnection;
    constructor(dailyEngagementModel: Model<DailyEngagementDocument>, rewardModel: Model<RewardDocument>, configService: ConfigService);
    trackEngagement(walletAddress: string, action: 'post' | 'likeReceived' | 'commentReceived' | 'view' | 'likeGiven' | 'commentGiven'): Promise<void>;
    getTodayEngagement(walletAddress: string): Promise<{
        date: Date;
        postsCreated: number;
        likesReceived: number;
        commentsReceived: number;
        viewsReceived: number;
        likesGiven: number;
        commentsGiven: number;
        totalPoints: number;
        estimatedTokens: number;
    }>;
    getRewardsHistory(walletAddress: string, page?: number, limit?: number): Promise<{
        totalEarned: any;
        history: (import("mongoose").Document<unknown, {}, RewardDocument, {}, import("mongoose").DefaultSchemaOptions> & Reward & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    distributeDaily(): Promise<void>;
    private sendTokens;
    private getToday;
    private getYesterday;
}
