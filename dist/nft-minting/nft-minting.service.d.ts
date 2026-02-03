import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { NftDocument } from './schemas/nft.schema';
import { ArweaveService } from './services/arweave.service';
export declare class NftMintingService {
    private nftModel;
    private arweaveService;
    private configService;
    private readonly logger;
    private connection;
    constructor(nftModel: Model<NftDocument>, arweaveService: ArweaveService, configService: ConfigService);
    mintPost(postId: string, post: any, royaltyPercentage: number): Promise<NftDocument>;
    private mintNftOnChain;
    getNftByMintAddress(mintAddress: string): Promise<NftDocument>;
    getUserNfts(walletAddress: string): Promise<NftDocument[]>;
    checkIfPostMinted(postId: string): Promise<{
        minted: boolean;
        nft?: NftDocument;
    }>;
    getMintingStats(): Promise<any>;
}
