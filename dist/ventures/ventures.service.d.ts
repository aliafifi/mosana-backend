import { Model } from 'mongoose';
import { VentureDocument } from './schemas/venture.schema';
import { RevenueSplitDocument } from './schemas/revenue-split.schema';
import { CreateVentureDto } from './dto/create-venture.dto';
import { ReputationService } from '../reputation/reputation.service';
export declare class VenturesService {
    private ventureModel;
    private revenueSplitModel;
    private reputationService;
    private readonly logger;
    constructor(ventureModel: Model<VentureDocument>, revenueSplitModel: Model<RevenueSplitDocument>, reputationService: ReputationService);
    createVenture(createVentureDto: CreateVentureDto, initiatorWallet: string): Promise<VentureDocument>;
    acceptVenture(ventureId: string, walletAddress: string): Promise<VentureDocument>;
    rejectVenture(ventureId: string, walletAddress: string): Promise<VentureDocument>;
    splitRevenue(ventureId: string, totalAmount: number, source: 'tip' | 'nft-sale' | 'royalty' | 'other', sender?: string): Promise<RevenueSplitDocument>;
    getVentureByPostId(postId: string): Promise<VentureDocument | null>;
    getUserVentures(walletAddress: string): Promise<VentureDocument[]>;
    getPendingInvitations(walletAddress: string): Promise<VentureDocument[]>;
    getVentureSplitHistory(ventureId: string): Promise<RevenueSplitDocument[]>;
    getUserVentureEarnings(walletAddress: string): Promise<any>;
    getUserVentureStats(walletAddress: string): Promise<any>;
    getVentureStats(): Promise<any>;
}
