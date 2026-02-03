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
exports.ReputationController = void 0;
const common_1 = require("@nestjs/common");
const reputation_service_1 = require("./reputation.service");
const penalty_dto_1 = require("./dto/penalty.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const admin_guard_1 = require("../common/guards/admin.guard");
let ReputationController = class ReputationController {
    reputationService;
    constructor(reputationService) {
        this.reputationService = reputationService;
    }
    async getReputation(walletAddress) {
        try {
            const reputation = await this.reputationService.getReputation(walletAddress);
            return {
                success: true,
                data: {
                    walletAddress: reputation.walletAddress,
                    totalScore: reputation.totalScore,
                    level: reputation.level,
                    rewardMultiplier: reputation.rewardMultiplier,
                    breakdown: reputation.breakdown,
                    badges: reputation.badges,
                    isFlagged: reputation.isFlagged,
                    flagReason: reputation.flagReason,
                    lastCalculated: reputation.lastCalculated,
                },
                message: 'Reputation retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getLeaderboard() {
        try {
            const leaderboard = await this.reputationService.getLeaderboard(100);
            return {
                success: true,
                data: leaderboard.map((rep, index) => ({
                    rank: index + 1,
                    walletAddress: rep.walletAddress,
                    totalScore: rep.totalScore,
                    level: rep.level,
                    badges: rep.badges,
                })),
                message: 'Leaderboard retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getPlatformStats() {
        try {
            const stats = await this.reputationService.getPlatformStats();
            return {
                success: true,
                data: stats,
                message: 'Platform stats retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getMyReputation(req) {
        try {
            const walletAddress = req.user.walletAddress;
            const reputation = await this.reputationService.getReputation(walletAddress);
            return {
                success: true,
                data: {
                    walletAddress: reputation.walletAddress,
                    totalScore: reputation.totalScore,
                    level: reputation.level,
                    rewardMultiplier: reputation.rewardMultiplier,
                    breakdown: reputation.breakdown,
                    metrics: reputation.metrics,
                    badges: reputation.badges,
                    penalties: reputation.penalties,
                    isFlagged: reputation.isFlagged,
                    lastCalculated: reputation.lastCalculated,
                    calculationCount: reputation.calculationCount,
                },
                message: 'Your reputation retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async calculateReputation(walletAddress) {
        try {
            const reputation = await this.reputationService.calculateReputation(walletAddress);
            return {
                success: true,
                data: {
                    walletAddress: reputation.walletAddress,
                    totalScore: reputation.totalScore,
                    level: reputation.level,
                    breakdown: reputation.breakdown,
                },
                message: 'Reputation recalculated successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async applyPenalty(penaltyDto, req) {
        try {
            const adminWallet = req.user.walletAddress;
            const reputation = await this.reputationService.applyPenalty(penaltyDto, adminWallet);
            return {
                success: true,
                data: {
                    walletAddress: reputation.walletAddress,
                    totalScore: reputation.totalScore,
                    level: reputation.level,
                    penalties: reputation.penalties,
                },
                message: 'Penalty applied successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getFlaggedAccounts() {
        try {
            const flaggedAccounts = await this.reputationService['reputationModel']
                .find({ isFlagged: true })
                .select('walletAddress totalScore level flagReason lastCalculated')
                .limit(100)
                .exec();
            return {
                success: true,
                data: flaggedAccounts,
                message: 'Flagged accounts retrieved successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
exports.ReputationController = ReputationController;
__decorate([
    (0, common_1.Get)(':walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getReputation", null);
__decorate([
    (0, common_1.Get)('leaderboard/top'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('stats/platform'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getPlatformStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/score'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getMyReputation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('calculate/:walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "calculateReputation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('admin/penalty'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [penalty_dto_1.ApplyPenaltyDto, Object]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "applyPenalty", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)('admin/flagged'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getFlaggedAccounts", null);
exports.ReputationController = ReputationController = __decorate([
    (0, common_1.Controller)('reputation'),
    __metadata("design:paramtypes", [reputation_service_1.ReputationService])
], ReputationController);
//# sourceMappingURL=reputation.controller.js.map