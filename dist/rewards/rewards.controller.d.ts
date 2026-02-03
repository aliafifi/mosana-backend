import { RewardsService } from './rewards.service';
export declare class RewardsController {
    private readonly rewardsService;
    constructor(rewardsService: RewardsService);
    getTodayProgress(req: any): Promise<{
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
    getRewardsHistory(req: any, page: number, limit: number): Promise<{
        totalEarned: any;
        history: (import("mongoose").Document<unknown, {}, import("./reward.schema").RewardDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./reward.schema").Reward & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getTokenomics(): {
        totalSupply: number;
        communityPool: number;
        currentYear: number;
        yearlyAllocation: number;
        dailyPool: number;
        pointValues: {
            postCreated: number;
            likeReceived: number;
            commentReceived: number;
            viewReceived: number;
            likeGiven: number;
            commentGiven: number;
        };
        minimumPoints: number;
        maxPointsPerDay: number;
    };
    private getYearlyAllocation;
    private getDailyPool;
}
