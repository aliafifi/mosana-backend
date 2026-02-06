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
exports.TippingController = void 0;
const common_1 = require("@nestjs/common");
const tipping_service_1 = require("./tipping.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_tip_dto_1 = require("./dto/create-tip.dto");
let TippingController = class TippingController {
    tippingService;
    constructor(tippingService) {
        this.tippingService = tippingService;
    }
    async createTip(req, createTipDto) {
        return this.tippingService.createTip(req.user.walletAddress, createTipDto);
    }
    async getSentTips(req, page, limit) {
        return this.tippingService.getSentTips(req.user.walletAddress, page, limit);
    }
    async getReceivedTips(req, page, limit) {
        return this.tippingService.getReceivedTips(req.user.walletAddress, page, limit);
    }
    async getPostTips(postId) {
        return this.tippingService.getPostTips(postId);
    }
    async getUserStats(req) {
        return this.tippingService.getUserStats(req.user.walletAddress);
    }
    async getPlatformStats() {
        return this.tippingService.getPlatformStats();
    }
    async getFeePreview(amount) {
        return this.tippingService.calculateFeePreview(amount);
    }
    async getFeeTiers() {
        return {
            tiers: [
                { name: 'Small', max: 100, fee: '1%', description: 'Tips up to 100 tokens' },
                { name: 'Medium', max: 1000, fee: '0.75%', description: 'Tips 101-1,000 tokens' },
                { name: 'Large', max: 10000, fee: '0.5%', description: 'Tips 1,001-10,000 tokens' },
                { name: 'Whale', max: 'Unlimited', fee: '0.25%', description: 'Tips over 10,000 tokens' },
            ],
            feeSplit: {
                burned: '50%',
                rewards: '50%',
                description: 'Half of fees are burned forever 🔥, half fund community rewards',
            },
            comparison: {
                mosana: '0.25% - 1%',
                youtube: '30%',
                patreon: '5-12%',
                onlyfans: '20%',
                message: 'Mosana has the lowest fees in social media!',
            },
        };
    }
};
exports.TippingController = TippingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_tip_dto_1.CreateTipDto]),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "createTip", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sent'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getSentTips", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('received'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getReceivedTips", null);
__decorate([
    (0, common_1.Get)('post/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getPostTips", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('stats/platform'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getPlatformStats", null);
__decorate([
    (0, common_1.Get)('preview/:amount'),
    __param(0, (0, common_1.Param)('amount', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getFeePreview", null);
__decorate([
    (0, common_1.Get)('fee-tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TippingController.prototype, "getFeeTiers", null);
exports.TippingController = TippingController = __decorate([
    (0, common_1.Controller)('tipping'),
    __metadata("design:paramtypes", [tipping_service_1.TippingService])
], TippingController);
//# sourceMappingURL=tipping.controller.js.map