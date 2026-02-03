import { NftMintingService } from './nft-minting.service';
import { Model } from 'mongoose';
import { Post as PostModel } from '../posts/post.schema';
export declare class NftMintingController {
    private readonly nftMintingService;
    private postModel;
    constructor(nftMintingService: NftMintingService, postModel: Model<PostModel>);
    mintPost(postId: string, royaltyPercentage: number | undefined, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            mintAddress: string;
            metadataUri: string;
            royaltyPercentage: number;
            nft: import("./schemas/nft.schema").NftDocument;
        };
    }>;
    getNft(mintAddress: string): Promise<{
        success: boolean;
        data: import("./schemas/nft.schema").NftDocument;
    }>;
    getUserNfts(walletAddress: string): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/nft.schema").NftDocument[];
    }>;
    checkPostMinted(postId: string): Promise<{
        minted: boolean;
        nft?: import("./schemas/nft.schema").NftDocument;
        success: boolean;
    }>;
    getMintingStats(): Promise<{
        success: boolean;
        data: any;
    }>;
}
