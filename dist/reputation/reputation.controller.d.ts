import { ReputationService } from './reputation.service';
import { ApplyPenaltyDto } from './dto/penalty.dto';
export declare class ReputationController {
    private readonly reputationService;
    constructor(reputationService: ReputationService);
    getReputation(walletAddress: string): Promise<{
        success: boolean;
        data: {
            walletAddress: any;
            totalScore: any;
            level: any;
            rewardMultiplier: any;
            verificationMultiplier: any;
            totalMultiplier: any;
            verificationStatus: any;
            breakdown: any;
            badges: any;
            isFlagged: any;
            flagReason: any;
            lastCalculated: any;
        };
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getLeaderboard(): Promise<{
        success: boolean;
        data: {
            rank: number;
            walletAddress: string;
            totalScore: number;
            level: string;
            badges: string[];
        }[];
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getPlatformStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            flaggedUsers: number;
            levelDistribution: any[];
            averageScore: any;
        };
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getMyReputation(req: any): Promise<{
        success: boolean;
        data: {
            walletAddress: any;
            totalScore: any;
            level: any;
            rewardMultiplier: any;
            verificationMultiplier: any;
            totalMultiplier: any;
            verificationStatus: any;
            breakdown: any;
            metrics: any;
            badges: any;
            penalties: any;
            isFlagged: any;
            lastCalculated: any;
            calculationCount: any;
        };
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    calculateReputation(walletAddress: string): Promise<{
        success: boolean;
        data: {
            walletAddress: string;
            totalScore: number;
            level: string;
            breakdown: {
                accountAge: {
                    points: number;
                    maxPoints: number;
                };
                engagement: {
                    points: number;
                    maxPoints: number;
                };
                economic: {
                    points: number;
                    maxPoints: number;
                };
                socialGood: {
                    points: number;
                    maxPoints: number;
                };
                dao: {
                    points: number;
                    maxPoints: number;
                };
                nft: {
                    points: number;
                    maxPoints: number;
                };
                trust: {
                    points: number;
                    maxPoints: number;
                };
            };
        };
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    applyPenalty(penaltyDto: ApplyPenaltyDto, req: any): Promise<{
        success: boolean;
        data: {
            walletAddress: string;
            totalScore: number;
            level: string;
            penalties: {
                reason: string;
                points: number;
                date: Date;
                adminWallet?: string;
                details?: string;
            }[];
        };
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getFlaggedAccounts(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/reputation.schema").ReputationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reputation.schema").Reputation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        message: string;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
