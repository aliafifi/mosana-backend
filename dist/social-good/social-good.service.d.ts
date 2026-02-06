import { Model } from 'mongoose';
import { CauseDocument } from './schemas/cause.schema';
import { DonationDocument } from './schemas/donation.schema';
import { CreateCauseDto } from './dto/create-cause.dto';
import { ReputationService } from '../reputation/reputation.service';
export declare class SocialGoodService {
    private causeModel;
    private donationModel;
    private reputationService;
    private readonly logger;
    constructor(causeModel: Model<CauseDocument>, donationModel: Model<DonationDocument>, reputationService: ReputationService);
    createCause(createCauseDto: CreateCauseDto): Promise<CauseDocument>;
    getAllCauses(category?: string): Promise<CauseDocument[]>;
    getCauseById(causeId: string): Promise<CauseDocument>;
    processPostDonation(postId: string, causeId: string, donorWallet: string, totalAmount: number, charityPercentage: number, source: string, sourceTransactionId?: string): Promise<{
        creatorAmount: number;
        donationAmount: number;
        donation: DonationDocument;
    }>;
    directDonate(donorWallet: string, causeId: string, amount: number): Promise<DonationDocument>;
    getUserDonations(walletAddress: string): Promise<DonationDocument[]>;
    getCauseDonations(causeId: string): Promise<DonationDocument[]>;
    getPlatformStats(): Promise<any>;
}
