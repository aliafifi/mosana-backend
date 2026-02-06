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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("./user.schema");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_schema_1 = require("../notifications/schemas/notification.schema");
let UsersService = class UsersService {
    userModel;
    configService;
    notificationsService;
    solanaConnection;
    constructor(userModel, configService, notificationsService) {
        this.userModel = userModel;
        this.configService = configService;
        this.notificationsService = notificationsService;
        const rpcUrl = this.configService.get('SOLANA_RPC_URL');
        this.solanaConnection = new web3_js_1.Connection(rpcUrl || 'https://api.devnet.solana.com');
    }
    async findByWallet(walletAddress) {
        const user = await this.userModel.findOne({ walletAddress }).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(walletAddress, updateProfileDto) {
        if (updateProfileDto.username) {
            const existingUser = await this.userModel.findOne({
                username: updateProfileDto.username,
                walletAddress: { $ne: walletAddress },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        const user = await this.userModel.findOneAndUpdate({ walletAddress }, { $set: updateProfileDto }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async setNftProfilePicture(walletAddress, setNftPfpDto) {
        const { nftMintAddress } = setNftPfpDto;
        const ownsNft = await this.verifyNftOwnership(walletAddress, nftMintAddress);
        if (!ownsNft) {
            throw new common_1.BadRequestException('You do not own this NFT');
        }
        const user = await this.userModel.findOneAndUpdate({ walletAddress }, { $set: { nftProfilePicture: nftMintAddress } }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async followUser(followerWallet, followingWallet) {
        if (followerWallet === followingWallet) {
            throw new common_1.BadRequestException('You cannot follow yourself');
        }
        const targetUser = await this.userModel.findOne({ walletAddress: followingWallet });
        if (!targetUser) {
            throw new common_1.NotFoundException('User to follow not found');
        }
        const currentUser = await this.userModel.findOne({ walletAddress: followerWallet });
        if (!currentUser) {
            throw new common_1.NotFoundException('Current user not found');
        }
        if (currentUser.following.includes(followingWallet)) {
            throw new common_1.ConflictException('Already following this user');
        }
        await this.userModel.findOneAndUpdate({ walletAddress: followerWallet }, {
            $push: { following: followingWallet },
            $inc: { followingCount: 1 },
        });
        await this.userModel.findOneAndUpdate({ walletAddress: followingWallet }, { $inc: { followersCount: 1 } });
        try {
            await this.notificationsService.createNotification({
                recipientWallet: followingWallet,
                actorWallet: followerWallet,
                type: notification_schema_1.NotificationType.FOLLOW_NEW,
                title: 'New follower!',
                message: `@${followerWallet.slice(0, 8)}... started following you`,
                data: {
                    followerWallet,
                },
                actionUrl: `mosana://profile/${followerWallet}`,
                priority: 'normal',
            });
        }
        catch (error) {
            console.warn(`Notification failed for follow: ${error.message}`);
        }
        return { message: 'Successfully followed user' };
    }
    async unfollowUser(followerWallet, followingWallet) {
        await this.userModel.findOneAndUpdate({ walletAddress: followerWallet }, {
            $pull: { following: followingWallet },
            $inc: { followingCount: -1 },
        });
        await this.userModel.findOneAndUpdate({ walletAddress: followingWallet }, { $inc: { followersCount: -1 } });
        return { message: 'Successfully unfollowed user' };
    }
    async verifyNftOwnership(walletAddress, nftMintAddress) {
        try {
            const walletPublicKey = new web3_js_1.PublicKey(walletAddress);
            const mintPublicKey = new web3_js_1.PublicKey(nftMintAddress);
            const tokenAccounts = await this.solanaConnection.getParsedTokenAccountsByOwner(walletPublicKey, { programId: new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') });
            const ownsToken = tokenAccounts.value.some((accountInfo) => {
                const mint = accountInfo.account.data.parsed.info.mint;
                const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
                return mint === nftMintAddress && amount > 0;
            });
            return ownsToken;
        }
        catch (error) {
            console.error('NFT ownership verification error:', error);
            return false;
        }
    }
    async registerFcmToken(walletAddress, fcmToken) {
        await this.userModel.findOneAndUpdate({ walletAddress }, { $addToSet: { fcmTokens: fcmToken } });
        return { message: 'FCM token registered successfully' };
    }
    async unregisterFcmToken(walletAddress, fcmToken) {
        await this.userModel.findOneAndUpdate({ walletAddress }, { $pull: { fcmTokens: fcmToken } });
        return { message: 'FCM token unregistered successfully' };
    }
    async getFcmTokens(walletAddress) {
        const user = await this.userModel.findOne({ walletAddress }).select('fcmTokens');
        return user?.fcmTokens || [];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map