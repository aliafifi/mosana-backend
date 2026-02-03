import { TippingService } from './tipping.service';
import { CreateTipDto } from './dto/create-tip.dto';
export declare class TippingController {
    private readonly tippingService;
    constructor(tippingService: TippingService);
    createTip(req: any, createTipDto: CreateTipDto): Promise<import("./tip.schema").Tip>;
    getSentTips(req: any, page: number, limit: number): Promise<{
        totalSent: any;
        tips: (import("mongoose").Document<unknown, {}, import("./tip.schema").TipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tip.schema").Tip & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getReceivedTips(req: any, page: number, limit: number): Promise<{
        totalReceived: any;
        tips: (import("mongoose").Document<unknown, {}, import("./tip.schema").TipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tip.schema").Tip & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
        tips: (import("mongoose").Document<unknown, {}, import("./tip.schema").TipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tip.schema").Tip & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getPlatformStats(): Promise<any>;
    getFeePreview(amount: number): Promise<{
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
    }>;
    getFeeTiers(): Promise<{
        tiers: ({
            name: string;
            max: number;
            fee: string;
            description: string;
        } | {
            name: string;
            max: string;
            fee: string;
            description: string;
        })[];
        feeSplit: {
            burned: string;
            rewards: string;
            description: string;
        };
        comparison: {
            mosana: string;
            youtube: string;
            patreon: string;
            onlyfans: string;
            message: string;
        };
    }>;
}
