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
var SocialGoodService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialGoodService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cause_schema_1 = require("./schemas/cause.schema");
const donation_schema_1 = require("./schemas/donation.schema");
let SocialGoodService = SocialGoodService_1 = class SocialGoodService {
    causeModel;
    donationModel;
    logger = new common_1.Logger(SocialGoodService_1.name);
    constructor(causeModel, donationModel) {
        this.causeModel = causeModel;
        this.donationModel = donationModel;
    }
    async createCause(createCauseDto) {
        const existingCause = await this.causeModel.findOne({
            walletAddress: createCauseDto.walletAddress
        });
        if (existingCause) {
            throw new common_1.BadRequestException('A cause with this wallet address already exists');
        }
        const cause = new this.causeModel({
            ...createCauseDto,
            isVerified: true,
            isActive: true,
        });
        await cause.save();
        this.logger.log(`New cause created: ${cause.name}`);
        return cause;
    }
    async getAllCauses(category) {
        const filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        return this.causeModel.find(filter).sort({ totalDonationsReceived: -1 });
    }
    async getCauseById(causeId) {
        const cause = await this.causeModel.findById(causeId);
        if (!cause) {
            throw new common_1.NotFoundException('Cause not found');
        }
        return cause;
    }
    async processPostDonation(postId, causeId, donorWallet, totalAmount, charityPercentage, source, sourceTransactionId) {
        const cause = await this.getCauseById(causeId);
        if (!cause.isActive) {
            throw new common_1.BadRequestException('This cause is not currently accepting donations');
        }
        const donationAmount = Math.floor((totalAmount * charityPercentage) / 100);
        const creatorAmount = totalAmount - donationAmount;
        const donation = new this.donationModel({
            donorWallet,
            causeId,
            amount: donationAmount,
            pledgePercentage: charityPercentage,
            source,
            originalAmount: totalAmount,
            sourceTransactionId,
        });
        await donation.save();
        cause.totalDonationsReceived += donationAmount;
        const uniqueDonors = await this.donationModel.distinct('donorWallet', {
            causeId: cause._id
        });
        cause.totalDonors = uniqueDonors.length;
        await cause.save();
        this.logger.log(`Donation processed: ${donorWallet} donated ${donationAmount} (${charityPercentage}%) to ${cause.name} from ${source}`);
        return {
            creatorAmount,
            donationAmount,
            donation,
        };
    }
    async directDonate(donorWallet, causeId, amount) {
        const cause = await this.getCauseById(causeId);
        if (!cause.isActive) {
            throw new common_1.BadRequestException('This cause is not currently accepting donations');
        }
        if (amount <= 0) {
            throw new common_1.BadRequestException('Donation amount must be greater than 0');
        }
        const donation = new this.donationModel({
            donorWallet,
            causeId,
            amount,
            pledgePercentage: 100,
            source: 'manual',
            originalAmount: amount,
        });
        await donation.save();
        cause.totalDonationsReceived += amount;
        const uniqueDonors = await this.donationModel.distinct('donorWallet', {
            causeId: cause._id
        });
        cause.totalDonors = uniqueDonors.length;
        await cause.save();
        this.logger.log(`Direct donation: ${donorWallet} donated ${amount} tokens to ${cause.name}`);
        return donation;
    }
    async getUserDonations(walletAddress) {
        return this.donationModel
            .find({ donorWallet: walletAddress })
            .populate('causeId')
            .sort({ createdAt: -1 });
    }
    async getCauseDonations(causeId) {
        return this.donationModel
            .find({ causeId })
            .sort({ createdAt: -1 })
            .limit(100);
    }
    async getPlatformStats() {
        const totalCauses = await this.causeModel.countDocuments({ isActive: true });
        const donationStats = await this.donationModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalDonations: { $sum: '$amount' },
                    donationCount: { $sum: 1 },
                },
            },
        ]);
        const uniqueDonors = await this.donationModel.distinct('donorWallet');
        return {
            totalCauses,
            totalDonations: donationStats[0]?.totalDonations || 0,
            donationCount: donationStats[0]?.donationCount || 0,
            uniqueDonors: uniqueDonors.length,
        };
    }
};
exports.SocialGoodService = SocialGoodService;
exports.SocialGoodService = SocialGoodService = SocialGoodService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cause_schema_1.Cause.name)),
    __param(1, (0, mongoose_1.InjectModel)(donation_schema_1.Donation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SocialGoodService);
//# sourceMappingURL=social-good.service.js.map