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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftMintingController = void 0;
const common_1 = require("@nestjs/common");
const nft_minting_service_1 = require("./nft-minting.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("../posts/post.schema");
let NftMintingController = class NftMintingController {
    nftMintingService;
    postModel;
    constructor(nftMintingService, postModel) {
        this.nftMintingService = nftMintingService;
        this.postModel = postModel;
    }
    async mintPost(postId, royaltyPercentage = 5, req) {
        const post = await this.postModel
            .findById(postId)
            .populate('author')
            .exec();
        if (!post) {
            return {
                success: false,
                message: 'Post not found',
            };
        }
        if (post.author.walletAddress !== req.user.walletAddress) {
            return {
                success: false,
                message: 'You can only mint your own posts',
            };
        }
        const nft = await this.nftMintingService.mintPost(postId, post, royaltyPercentage);
        return {
            success: true,
            message: 'Post minted as NFT successfully',
            data: {
                mintAddress: nft.mintAddress,
                metadataUri: nft.metadataUri,
                royaltyPercentage: nft.royaltyPercentage,
                nft,
            },
        };
    }
    async getNft(mintAddress) {
        const nft = await this.nftMintingService.getNftByMintAddress(mintAddress);
        return {
            success: true,
            data: nft,
        };
    }
    async getUserNfts(walletAddress) {
        const nfts = await this.nftMintingService.getUserNfts(walletAddress);
        return {
            success: true,
            count: nfts.length,
            data: nfts,
        };
    }
    async checkPostMinted(postId) {
        const result = await this.nftMintingService.checkIfPostMinted(postId);
        return {
            success: true,
            ...result,
        };
    }
    async getMintingStats() {
        const stats = await this.nftMintingService.getMintingStats();
        return {
            success: true,
            data: stats,
        };
    }
};
exports.NftMintingController = NftMintingController;
__decorate([
    (0, common_1.Post)('mint/:postId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)('royaltyPercentage')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], NftMintingController.prototype, "mintPost", null);
__decorate([
    (0, common_1.Get)(':mintAddress'),
    __param(0, (0, common_1.Param)('mintAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftMintingController.prototype, "getNft", null);
__decorate([
    (0, common_1.Get)('user/:walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftMintingController.prototype, "getUserNfts", null);
__decorate([
    (0, common_1.Get)('check/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftMintingController.prototype, "checkPostMinted", null);
__decorate([
    (0, common_1.Get)('stats/platform'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NftMintingController.prototype, "getMintingStats", null);
exports.NftMintingController = NftMintingController = __decorate([
    (0, common_1.Controller)('nft'),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [nft_minting_service_1.NftMintingService,
        mongoose_2.Model])
], NftMintingController);
//# sourceMappingURL=nft-minting.controller.js.map