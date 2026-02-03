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
exports.RewardsController = void 0;
const common_1 = require("@nestjs/common");
const rewards_service_1 = require("./rewards.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let RewardsController = class RewardsController {
    rewardsService;
    constructor(rewardsService) {
        this.rewardsService = rewardsService;
    }
    async getTodayProgress(req) {
        return this.rewardsService.getTodayEngagement(req.user.walletAddress);
    }
    async getRewardsHistory(req, page, limit) {
        return this.rewardsService.getRewardsHistory(req.user.walletAddress, page, limit);
    }
    getTokenomics() {
        const currentYear = new Date().getFullYear();
        return {
            totalSupply: 10_000_000_000,
            communityPool: 4_500_000_000,
            currentYear,
            yearlyAllocation: this.getYearlyAllocation(currentYear),
            dailyPool: this.getDailyPool(currentYear),
            pointValues: {
                postCreated: 10,
                likeReceived: 5,
                commentReceived: 8,
                viewReceived: 1,
                likeGiven: 1,
                commentGiven: 2,
            },
            minimumPoints: 10,
            maxPointsPerDay: 10_000,
        };
    }
    getYearlyAllocation(year) {
        const schedule = {
            2026: 600_000_000,
            2027: 550_000_000,
            2028: 500_000_000,
            2029: 450_000_000,
            2030: 400_000_000,
            2031: 375_000_000,
            2032: 350_000_000,
            2033: 325_000_000,
            2034: 300_000_000,
            2035: 250_000_000,
        };
        return schedule[year] || 250_000_000;
    }
    getDailyPool(year) {
        return Math.floor(this.getYearlyAllocation(year) / 365);
    }
};
exports.RewardsController = RewardsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "getTodayProgress", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "getRewardsHistory", null);
__decorate([
    (0, common_1.Get)('tokenomics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RewardsController.prototype, "getTokenomics", null);
exports.RewardsController = RewardsController = __decorate([
    (0, common_1.Controller)('rewards'),
    __metadata("design:paramtypes", [rewards_service_1.RewardsService])
], RewardsController);
//# sourceMappingURL=rewards.controller.js.map