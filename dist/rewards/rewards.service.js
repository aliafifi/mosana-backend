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
var RewardsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const web3_js_1 = require("@solana/web3.js");
const reward_schema_1 = require("./reward.schema");
const reward_schema_2 = require("./reward.schema");
const rewards_config_1 = require("./rewards.config");
const reputation_service_1 = require("../reputation/reputation.service");
let RewardsService = RewardsService_1 = class RewardsService {
    dailyEngagementModel;
    rewardModel;
    configService;
    reputationService;
    logger = new common_1.Logger(RewardsService_1.name);
    solanaConnection;
    constructor(dailyEngagementModel, rewardModel, configService, reputationService) {
        this.dailyEngagementModel = dailyEngagementModel;
        this.rewardModel = rewardModel;
        this.configService = configService;
        this.reputationService = reputationService;
        const rpcUrl = this.configService.get('SOLANA_RPC_URL');
        this.solanaConnection = new web3_js_1.Connection(rpcUrl || 'https://api.devnet.solana.com');
    }
    async trackEngagement(walletAddress, action) {
        const today = this.getToday();
        let engagement = await this.dailyEngagementModel.findOne({
            walletAddress,
            date: today,
        });
        if (!engagement) {
            engagement = await this.dailyEngagementModel.create({
                walletAddress,
                date: today,
                postsCreated: 0,
                likesReceived: 0,
                commentsReceived: 0,
                viewsReceived: 0,
                likesGiven: 0,
                commentsGiven: 0,
                totalPoints: 0,
                tokensEarned: 0,
                isDistributed: false,
            });
        }
        switch (action) {
            case 'post':
                engagement.postsCreated += 1;
                break;
            case 'likeReceived':
                engagement.likesReceived += 1;
                break;
            case 'commentReceived':
                engagement.commentsReceived += 1;
                break;
            case 'view':
                engagement.viewsReceived += 1;
                break;
            case 'likeGiven':
                engagement.likesGiven += 1;
                break;
            case 'commentGiven':
                engagement.commentsGiven += 1;
                break;
        }
        engagement.totalPoints = rewards_config_1.TOKENOMICS.calculatePoints({
            postsCreated: engagement.postsCreated,
            likesReceived: engagement.likesReceived,
            commentsReceived: engagement.commentsReceived,
            viewsReceived: engagement.viewsReceived,
            likesGiven: engagement.likesGiven,
            commentsGiven: engagement.commentsGiven,
        });
        if (engagement.totalPoints > rewards_config_1.TOKENOMICS.MAX_POINTS_PER_DAY) {
            engagement.totalPoints = rewards_config_1.TOKENOMICS.MAX_POINTS_PER_DAY;
        }
        await engagement.save();
    }
    async getTodayEngagement(walletAddress) {
        const today = this.getToday();
        const engagement = await this.dailyEngagementModel.findOne({
            walletAddress,
            date: today,
        });
        if (!engagement) {
            return {
                date: today,
                postsCreated: 0,
                likesReceived: 0,
                commentsReceived: 0,
                viewsReceived: 0,
                likesGiven: 0,
                commentsGiven: 0,
                totalPoints: 0,
                estimatedTokens: 0,
            };
        }
        let reputationMultiplier = 1.0;
        try {
            const reputation = await this.reputationService.getReputation(walletAddress);
            reputationMultiplier = reputation.rewardMultiplier;
        }
        catch (error) {
            this.logger.warn(`Failed to get reputation for ${walletAddress}: ${error.message}`);
        }
        const currentYear = new Date().getFullYear();
        const dailyPool = rewards_config_1.TOKENOMICS.getDailyPool(currentYear);
        const baseEstimate = Math.floor(dailyPool * 0.01);
        const estimatedTokens = Math.floor(baseEstimate * reputationMultiplier);
        return {
            date: engagement.date,
            postsCreated: engagement.postsCreated,
            likesReceived: engagement.likesReceived,
            commentsReceived: engagement.commentsReceived,
            viewsReceived: engagement.viewsReceived,
            likesGiven: engagement.likesGiven,
            commentsGiven: engagement.commentsGiven,
            totalPoints: engagement.totalPoints,
            estimatedTokens,
            reputationMultiplier,
        };
    }
    async getRewardsHistory(walletAddress, page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const rewards = await this.rewardModel
            .find({ walletAddress })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalEarned = await this.rewardModel
            .aggregate([
            { $match: { walletAddress } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
            .exec();
        return {
            totalEarned: totalEarned[0]?.total || 0,
            history: rewards,
        };
    }
    async distributeDaily() {
        this.logger.log('Starting daily reward distribution...');
        try {
            const yesterday = this.getYesterday();
            const currentYear = new Date().getFullYear();
            const dailyPool = rewards_config_1.TOKENOMICS.getDailyPool(currentYear);
            const engagements = await this.dailyEngagementModel.find({
                date: yesterday,
                isDistributed: false,
                totalPoints: { $gte: rewards_config_1.TOKENOMICS.MINIMUM_POINTS_FOR_REWARD },
            });
            if (engagements.length === 0) {
                this.logger.log('No eligible users for distribution');
                return;
            }
            let totalWeightedPoints = 0;
            const userMultipliers = new Map();
            for (const engagement of engagements) {
                try {
                    const reputation = await this.reputationService.getReputation(engagement.walletAddress);
                    const multiplier = reputation.rewardMultiplier;
                    userMultipliers.set(engagement.walletAddress, multiplier);
                    totalWeightedPoints += engagement.totalPoints * multiplier;
                }
                catch (error) {
                    userMultipliers.set(engagement.walletAddress, 1.0);
                    totalWeightedPoints += engagement.totalPoints;
                    this.logger.warn(`Failed to get reputation for ${engagement.walletAddress}: ${error.message}`);
                }
            }
            this.logger.log(`Total weighted points: ${totalWeightedPoints}, Daily pool: ${dailyPool}`);
            for (const engagement of engagements) {
                const multiplier = userMultipliers.get(engagement.walletAddress) || 1.0;
                const weightedPoints = engagement.totalPoints * multiplier;
                const userShare = weightedPoints / totalWeightedPoints;
                const tokensEarned = Math.floor(dailyPool * userShare);
                if (tokensEarned < 1) {
                    continue;
                }
                try {
                    const txSignature = await this.sendTokens(engagement.walletAddress, tokensEarned);
                    await this.rewardModel.create({
                        walletAddress: engagement.walletAddress,
                        amount: tokensEarned,
                        date: yesterday,
                        engagementPoints: engagement.totalPoints,
                        transactionSignature: txSignature,
                        status: 'completed',
                    });
                    engagement.tokensEarned = tokensEarned;
                    engagement.isDistributed = true;
                    await engagement.save();
                    this.logger.log(`Distributed ${tokensEarned} tokens to ${engagement.walletAddress} (${multiplier}x multiplier)`);
                }
                catch (error) {
                    this.logger.error(`Failed to distribute to ${engagement.walletAddress}: ${error.message}`);
                    await this.rewardModel.create({
                        walletAddress: engagement.walletAddress,
                        amount: tokensEarned,
                        date: yesterday,
                        engagementPoints: engagement.totalPoints,
                        transactionSignature: 'failed',
                        status: 'failed',
                    });
                }
            }
            this.logger.log('Daily distribution completed successfully');
        }
        catch (error) {
            this.logger.error(`Distribution failed: ${error.message}`);
        }
    }
    async sendTokens(recipientAddress, amount) {
        this.logger.log(`[MOCK] Sending ${amount} tokens to ${recipientAddress}`);
        const mockSignature = `mock_tx_${Date.now()}_${recipientAddress.slice(0, 8)}`;
        return mockSignature;
    }
    getToday() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    getYesterday() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    }
};
exports.RewardsService = RewardsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RewardsService.prototype, "distributeDaily", null);
exports.RewardsService = RewardsService = RewardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reward_schema_1.DailyEngagement.name)),
    __param(1, (0, mongoose_1.InjectModel)(reward_schema_2.Reward.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService,
        reputation_service_1.ReputationService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map