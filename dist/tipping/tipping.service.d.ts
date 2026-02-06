import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Tip, TipDocument } from './tip.schema';
import { CreateTipDto } from './dto/create-tip.dto';
import { ReputationService } from '../reputation/reputation.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class TippingService {
    private tipModel;
    private configService;
    private reputationService;
    private notificationsService;
    private readonly logger;
    private solanaConnection;
    constructor(tipModel: Model<TipDocument>, configService: ConfigService, reputationService: ReputationService, notificationsService: NotificationsService);
    createTip(fromWallet: string, createTipDto: CreateTipDto): Promise<Tip>;
    getSentTips(walletAddress: string, page?: number, limit?: number): Promise<{
        totalSent: any;
        tips: (import("mongoose").Document<unknown, {}, TipDocument, {}, import("mongoose").DefaultSchemaOptions> & Tip & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getReceivedTips(walletAddress: string, page?: number, limit?: number): Promise<{
        totalReceived: any;
        tips: (import("mongoose").Document<unknown, {}, TipDocument, {}, import("mongoose").DefaultSchemaOptions> & Tip & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getPostTips(postId: string): Promise<{
        totalTipped: number;
        tipsCount: number;
        tips: (import("mongoose").Document<unknown, {}, TipDocument, {}, import("mongoose").DefaultSchemaOptions> & Tip & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getUserStats(walletAddress: string): Promise<{
        walletAddress: string;
        sent: any;
        received: any;
        netBalance: number;
    }>;
    getPlatformStats(): Promise<any>;
    calculateFeePreview(amount: number): {
        valid: boolean;
        error: string | undefined;
        amount?: undefined;
        recipientReceives?: undefined;
        fee?: undefined;
        tier?: undefined;
    } | {
        valid: boolean;
        amount: number;
        recipientReceives: number;
        fee: {
            total: number;
            percentage: number;
            burned: number;
            toRewards: number;
        };
        tier: string;
        error?: undefined;
    };
    private sendTipTransaction;
}
