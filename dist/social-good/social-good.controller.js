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
exports.SocialGoodController = void 0;
const common_1 = require("@nestjs/common");
const social_good_service_1 = require("./social-good.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_cause_dto_1 = require("./dto/create-cause.dto");
let SocialGoodController = class SocialGoodController {
    socialGoodService;
    constructor(socialGoodService) {
        this.socialGoodService = socialGoodService;
    }
    async createCause(createCauseDto) {
        const cause = await this.socialGoodService.createCause(createCauseDto);
        return {
            success: true,
            message: 'Charity cause created successfully',
            data: cause,
        };
    }
    async getAllCauses(category) {
        const causes = await this.socialGoodService.getAllCauses(category);
        return {
            success: true,
            count: causes.length,
            data: causes,
        };
    }
    async getCauseById(causeId) {
        const cause = await this.socialGoodService.getCauseById(causeId);
        return {
            success: true,
            data: cause,
        };
    }
    async directDonate(causeId, amount, req) {
        const donation = await this.socialGoodService.directDonate(req.user.walletAddress, causeId, amount);
        return {
            success: true,
            message: 'Donation successful! Thank you for your contribution.',
            data: donation,
        };
    }
    async getMyDonations(req) {
        const donations = await this.socialGoodService.getUserDonations(req.user.walletAddress);
        return {
            success: true,
            count: donations.length,
            data: donations,
        };
    }
    async getCauseDonations(causeId) {
        const donations = await this.socialGoodService.getCauseDonations(causeId);
        return {
            success: true,
            count: donations.length,
            data: donations,
        };
    }
    async getPlatformStats() {
        const stats = await this.socialGoodService.getPlatformStats();
        return {
            success: true,
            data: stats,
        };
    }
};
exports.SocialGoodController = SocialGoodController;
__decorate([
    (0, common_1.Post)('causes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cause_dto_1.CreateCauseDto]),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "createCause", null);
__decorate([
    (0, common_1.Get)('causes'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "getAllCauses", null);
__decorate([
    (0, common_1.Get)('causes/:causeId'),
    __param(0, (0, common_1.Param)('causeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "getCauseById", null);
__decorate([
    (0, common_1.Post)('donate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)('causeId')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "directDonate", null);
__decorate([
    (0, common_1.Get)('donations/my-donations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "getMyDonations", null);
__decorate([
    (0, common_1.Get)('causes/:causeId/donations'),
    __param(0, (0, common_1.Param)('causeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "getCauseDonations", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocialGoodController.prototype, "getPlatformStats", null);
exports.SocialGoodController = SocialGoodController = __decorate([
    (0, common_1.Controller)('social-good'),
    __metadata("design:paramtypes", [social_good_service_1.SocialGoodService])
], SocialGoodController);
//# sourceMappingURL=social-good.controller.js.map