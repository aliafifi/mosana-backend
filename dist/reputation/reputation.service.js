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
exports.ReputationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reputation_schema_1 = require("./schemas/reputation.schema");
const scoring_interface_1 = require("./interfaces/scoring.interface");
let ReputationService = class ReputationService {
    reputationModel;
    constructor(reputationModel) {
        this.reputationModel = reputationModel;
    }
    async calculateReputation(walletAddress) {
        let reputation = await this.reputationModel.findOne({ walletAddress });
        if (!reputation) {
            reputation = new this.reputationModel({
                walletAddress,
                firstActivity: new Date(),
            });
        }
        const metrics = reputation.metrics;
        const breakdown = {
            accountAge: { points: 0, maxPoints: 100 },
            engagement: { points: 0, maxPoints: 250 },
            economic: { points: 0, maxPoints: 200 },
            socialGood: { points: 0, maxPoints: 150 },
            dao: { points: 0, maxPoints: 100 },
            nft: { points: 0, maxPoints: 100 },
            trust: { points: 0, maxPoints: 100 },
        };
        const accountAgeDays = Math.floor((Date.now() - reputation.firstActivity.getTime()) / (1000 * 60 * 60 * 24));
        breakdown.accountAge.points = Math.min((accountAgeDays / scoring_interface_1.DEFAULT_SCORING_CONFIG.accountAge.daysForMaxScore) *
            scoring_interface_1.DEFAULT_SCORING_CONFIG.accountAge.maxPoints, scoring_interface_1.DEFAULT_SCORING_CONFIG.accountAge.maxPoints);
        let engagementPoints = 0;
        engagementPoints += metrics.totalPosts * scoring_interface_1.DEFAULT_SCORING_CONFIG.engagement.pointsPerPost;
        engagementPoints += metrics.totalLikes * scoring_interface_1.DEFAULT_SCORING_CONFIG.engagement.pointsPerLike;
        engagementPoints += metrics.totalComments * scoring_interface_1.DEFAULT_SCORING_CONFIG.engagement.pointsPerComment;
        breakdown.engagement.points = Math.min(engagementPoints, scoring_interface_1.DEFAULT_SCORING_CONFIG.engagement.maxPoints);
        if (accountAgeDays < 7 && metrics.totalPosts > scoring_interface_1.DEFAULT_SCORING_CONFIG.engagement.spamThreshold) {
            reputation.isFlagged = true;
            reputation.flagReason = 'rapid_posting_new_account';
        }
        const economicPoints = metrics.tipsReceived / scoring_interface_1.DEFAULT_SCORING_CONFIG.economic.mosanaPerPoint;
        breakdown.economic.points = Math.min(economicPoints, scoring_interface_1.DEFAULT_SCORING_CONFIG.economic.maxPoints);
        let socialGoodPoints = metrics.charityDonations / scoring_interface_1.DEFAULT_SCORING_CONFIG.socialGood.mosanaPerPoint;
        if (metrics.charityDonations >= scoring_interface_1.DEFAULT_SCORING_CONFIG.socialGood.minimumForBonus * 1000) {
            socialGoodPoints += scoring_interface_1.DEFAULT_SCORING_CONFIG.socialGood.consistencyBonus;
        }
        breakdown.socialGood.points = Math.min(socialGoodPoints, scoring_interface_1.DEFAULT_SCORING_CONFIG.socialGood.maxPoints);
        if (accountAgeDays > 90 && metrics.charityDonations === 0) {
            reputation.penalties.push({
                reason: 'zero_charity_90days',
                points: scoring_interface_1.PENALTY_PRESETS.zero_charity_90days,
                date: new Date(),
            });
        }
        let daoPoints = 0;
        daoPoints += metrics.daosJoined * scoring_interface_1.DEFAULT_SCORING_CONFIG.dao.pointsPerDao;
        daoPoints += metrics.proposalsCreated * scoring_interface_1.DEFAULT_SCORING_CONFIG.dao.pointsPerProposal;
        daoPoints += metrics.votesCast * scoring_interface_1.DEFAULT_SCORING_CONFIG.dao.pointsPerVote;
        breakdown.dao.points = Math.min(daoPoints, scoring_interface_1.DEFAULT_SCORING_CONFIG.dao.maxPoints);
        let nftPoints = 0;
        nftPoints += metrics.nftsMinted * scoring_interface_1.DEFAULT_SCORING_CONFIG.nft.pointsPerMint;
        nftPoints += metrics.nftsSold * scoring_interface_1.DEFAULT_SCORING_CONFIG.nft.pointsPerSale;
        nftPoints += metrics.nftRevenue / scoring_interface_1.DEFAULT_SCORING_CONFIG.nft.revenuePerPoint;
        breakdown.nft.points = Math.min(nftPoints, scoring_interface_1.DEFAULT_SCORING_CONFIG.nft.maxPoints);
        breakdown.trust.points = 0;
        let totalScore = breakdown.accountAge.points +
            breakdown.engagement.points +
            breakdown.economic.points +
            breakdown.socialGood.points +
            breakdown.dao.points +
            breakdown.nft.points +
            breakdown.trust.points;
        const totalPenalties = reputation.penalties.reduce((sum, p) => sum + p.points, 0);
        totalScore += totalPenalties;
        totalScore = Math.max(0, Math.min(1000, totalScore));
        let level = 'New';
        let rewardMultiplier = 1.0;
        if (totalScore >= 751) {
            level = 'Legend';
            rewardMultiplier = 3.0;
        }
        else if (totalScore >= 501) {
            level = 'Veteran';
            rewardMultiplier = 2.0;
        }
        else if (totalScore >= 301) {
            level = 'Trusted';
            rewardMultiplier = 1.5;
        }
        else if (totalScore >= 101) {
            level = 'Active';
            rewardMultiplier = 1.2;
        }
        const badges = [];
        if (reputation.firstActivity < new Date('2026-03-01')) {
            badges.push('early_adopter');
        }
        if (metrics.charityDonations >= 10000) {
            badges.push('charity_champion');
        }
        if (metrics.proposalsCreated >= 3) {
            badges.push('dao_leader');
        }
        if (metrics.nftsMinted >= 10) {
            badges.push('nft_artist');
        }
        if (metrics.tipsReceived >= 50000) {
            badges.push('community_pillar');
        }
        if (level === 'Legend') {
            badges.push('legend');
        }
        reputation.totalScore = totalScore;
        reputation.level = level;
        reputation.rewardMultiplier = rewardMultiplier;
        reputation.breakdown = breakdown;
        reputation.badges = badges;
        reputation.lastCalculated = new Date();
        reputation.calculationCount += 1;
        await reputation.save();
        return reputation;
    }
    async getReputation(walletAddress) {
        const reputation = await this.reputationModel.findOne({ walletAddress });
        if (!reputation) {
            return await this.calculateReputation(walletAddress);
        }
        return reputation;
    }
    async updateMetrics(walletAddress, updates) {
        let reputation = await this.reputationModel.findOne({ walletAddress });
        if (!reputation) {
            reputation = new this.reputationModel({
                walletAddress,
                firstActivity: new Date(),
            });
        }
        Object.keys(updates).forEach(key => {
            reputation.metrics[key] = (reputation.metrics[key] || 0) + updates[key];
        });
        await reputation.save();
        await this.calculateReputation(walletAddress);
    }
    async applyPenalty(penaltyDto, adminWallet) {
        const reputation = await this.getReputation(penaltyDto.walletAddress);
        reputation.penalties.push({
            reason: penaltyDto.reason,
            points: penaltyDto.points,
            date: new Date(),
            adminWallet,
            details: penaltyDto.details,
        });
        await reputation.save();
        return this.calculateReputation(penaltyDto.walletAddress);
    }
    async getLeaderboard(limit = 100) {
        return this.reputationModel
            .find({ isFlagged: false })
            .sort({ totalScore: -1 })
            .limit(limit)
            .exec();
    }
    async getPlatformStats() {
        const totalUsers = await this.reputationModel.countDocuments();
        const flaggedUsers = await this.reputationModel.countDocuments({ isFlagged: true });
        const levelCounts = await this.reputationModel.aggregate([
            { $group: { _id: '$level', count: { $sum: 1 } } }
        ]);
        const avgScore = await this.reputationModel.aggregate([
            { $group: { _id: null, avg: { $avg: '$totalScore' } } }
        ]);
        return {
            totalUsers,
            flaggedUsers,
            levelDistribution: levelCounts,
            averageScore: avgScore[0]?.avg || 0,
        };
    }
};
exports.ReputationService = ReputationService;
exports.ReputationService = ReputationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reputation_schema_1.Reputation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReputationService);
//# sourceMappingURL=reputation.service.js.map