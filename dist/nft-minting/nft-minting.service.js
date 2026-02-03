"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NftMintingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftMintingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const web3_js_1 = require("@solana/web3.js");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const bs58_1 = __importDefault(require("bs58"));
const nft_schema_1 = require("./schemas/nft.schema");
const arweave_service_1 = require("./services/arweave.service");
let NftMintingService = NftMintingService_1 = class NftMintingService {
    nftModel;
    arweaveService;
    configService;
    logger = new common_1.Logger(NftMintingService_1.name);
    connection;
    constructor(nftModel, arweaveService, configService) {
        this.nftModel = nftModel;
        this.arweaveService = arweaveService;
        this.configService = configService;
        const rpcUrl = this.configService.get('SOLANA_RPC_URL') || 'https://api.mainnet-beta.solana.com';
        this.connection = new web3_js_1.Connection(rpcUrl, 'confirmed');
    }
    async mintPost(postId, post, royaltyPercentage) {
        try {
            const existingNft = await this.nftModel.findOne({ postId });
            if (existingNft) {
                throw new common_1.BadRequestException('This post has already been minted as an NFT');
            }
            if (royaltyPercentage < 0 || royaltyPercentage > 50) {
                throw new common_1.BadRequestException('Royalty percentage must be between 0 and 50');
            }
            this.logger.log(`Starting NFT mint for post ${postId}`);
            const metadata = this.arweaveService.formatPostMetadata(post);
            const metadataUri = await this.arweaveService.uploadMetadata(metadata);
            this.logger.log(`Metadata uploaded: ${metadataUri}`);
            const mintAddress = await this.mintNftOnChain(metadata.name, metadataUri, post.author.walletAddress, royaltyPercentage);
            this.logger.log(`NFT minted on-chain: ${mintAddress}`);
            const nft = new this.nftModel({
                postId,
                mintAddress,
                metadataUri,
                creator: post.author.walletAddress,
                owner: post.author.walletAddress,
                royaltyPercentage,
                engagementSnapshot: {
                    likes: post.likes || 0,
                    comments: post.commentsCount || 0,
                    tips: 0,
                },
            });
            await nft.save();
            this.logger.log(`NFT saved to database: ${nft._id}`);
            return nft;
        }
        catch (error) {
            this.logger.error(`Failed to mint NFT for post ${postId}`, error);
            throw error;
        }
    }
    async mintNftOnChain(name, uri, creatorWallet, royaltyPercentage) {
        try {
            const privateKeyString = this.configService.get('PLATFORM_WALLET_PRIVATE_KEY');
            if (!privateKeyString) {
                throw new Error('Platform wallet private key not configured');
            }
            const umi = (0, umi_bundle_defaults_1.createUmi)(this.connection.rpcEndpoint)
                .use((0, mpl_token_metadata_1.mplTokenMetadata)());
            const privateKeyBytes = bs58_1.default.decode(privateKeyString);
            const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(privateKeyBytes));
            umi.use((0, umi_1.keypairIdentity)(keypair));
            const mint = (0, umi_1.generateSigner)(umi);
            await (0, mpl_token_metadata_1.createNft)(umi, {
                mint,
                name,
                uri,
                sellerFeeBasisPoints: (0, umi_1.percentAmount)(royaltyPercentage),
                creators: [
                    {
                        address: creatorWallet,
                        share: 100,
                        verified: false,
                    },
                ],
            }).sendAndConfirm(umi);
            return mint.publicKey.toString();
        }
        catch (error) {
            this.logger.error('Failed to mint NFT on-chain', error);
            throw error;
        }
    }
    async getNftByMintAddress(mintAddress) {
        const nft = await this.nftModel.findOne({ mintAddress }).populate('postId');
        if (!nft) {
            throw new common_1.NotFoundException('NFT not found');
        }
        return nft;
    }
    async getUserNfts(walletAddress) {
        return this.nftModel
            .find({ creator: walletAddress, isBurned: false })
            .populate('postId')
            .sort({ createdAt: -1 });
    }
    async checkIfPostMinted(postId) {
        const nft = await this.nftModel.findOne({ postId });
        return {
            minted: !!nft,
            nft: nft || undefined,
        };
    }
    async getMintingStats() {
        const totalMinted = await this.nftModel.countDocuments({ isBurned: false });
        const totalBurned = await this.nftModel.countDocuments({ isBurned: true });
        const recentMints = await this.nftModel
            .find({ isBurned: false })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('postId');
        return {
            totalMinted,
            totalBurned,
            recentMints,
        };
    }
};
exports.NftMintingService = NftMintingService;
exports.NftMintingService = NftMintingService = NftMintingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(nft_schema_1.Nft.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        arweave_service_1.ArweaveService,
        config_1.ConfigService])
], NftMintingService);
//# sourceMappingURL=nft-minting.service.js.map