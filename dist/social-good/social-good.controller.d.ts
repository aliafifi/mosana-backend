import { SocialGoodService } from './social-good.service';
import { CreateCauseDto } from './dto/create-cause.dto';
export declare class SocialGoodController {
    private readonly socialGoodService;
    constructor(socialGoodService: SocialGoodService);
    createCause(createCauseDto: CreateCauseDto): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/cause.schema").CauseDocument;
    }>;
    getAllCauses(category?: string): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/cause.schema").CauseDocument[];
    }>;
    getCauseById(causeId: string): Promise<{
        success: boolean;
        data: import("./schemas/cause.schema").CauseDocument;
    }>;
    directDonate(causeId: string, amount: number, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/donation.schema").DonationDocument;
    }>;
    getMyDonations(req: any): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/donation.schema").DonationDocument[];
    }>;
    getCauseDonations(causeId: string): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/donation.schema").DonationDocument[];
    }>;
    getPlatformStats(): Promise<{
        success: boolean;
        data: any;
    }>;
}
