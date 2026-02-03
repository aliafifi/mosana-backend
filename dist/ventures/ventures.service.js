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
var VenturesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenturesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const venture_schema_1 = require("./schemas/venture.schema");
const revenue_split_schema_1 = require("./schemas/revenue-split.schema");
let VenturesService = VenturesService_1 = class VenturesService {
    ventureModel;
    revenueSplitModel;
    logger = new common_1.Logger(VenturesService_1.name);
    constructor(ventureModel, revenueSplitModel) {
        this.ventureModel = ventureModel;
        this.revenueSplitModel = revenueSplitModel;
    }
    async createVenture(createVentureDto, initiatorWallet) {
        const totalShares = createVentureDto.collaborators.reduce((sum, collab) => sum + collab.sharePercentage, 0);
        if (totalShares !== 100) {
            throw new common_1.BadRequestException(`Share percentages must add up to 100%. Current total: ${totalShares}%`);
        }
        const existingVenture = await this.ventureModel.findOne({ postId: createVentureDto.postId });
        if (existingVenture) {
            throw new common_1.BadRequestException('A venture already exists for this post');
        }
        const wallets = createVentureDto.collaborators.map(c => c.walletAddress);
        const uniqueWallets = new Set(wallets);
        if (wallets.length !== uniqueWallets.size) {
            throw new common_1.BadRequestException('Duplicate collaborator wallets are not allowed');
        }
        const initiatorInList = createVentureDto.collaborators.some(c => c.walletAddress === initiatorWallet);
        if (!initiatorInList) {
            throw new common_1.BadRequestException('Initiator must be included in collaborators list');
        }
        const venture = new this.ventureModel({
            postId: createVentureDto.postId,
            initiator: initiatorWallet,
            collaborators: createVentureDto.collaborators.map(c => ({
                walletAddress: c.walletAddress,
                sharePercentage: c.sharePercentage,
                hasAccepted: c.walletAddress === initiatorWallet,
            })),
            description: createVentureDto.description,
            status: 'pending',
        });
        await venture.save();
        this.logger.log(`Venture created for post ${createVentureDto.postId} by ${initiatorWallet}`);
        return venture;
    }
    async acceptVenture(ventureId, walletAddress) {
        const venture = await this.ventureModel.findById(ventureId);
        if (!venture) {
            throw new common_1.NotFoundException('Venture not found');
        }
        const collaborator = venture.collaborators.find(c => c.walletAddress === walletAddress);
        if (!collaborator) {
            throw new common_1.BadRequestException('You are not a collaborator in this venture');
        }
        if (collaborator.hasAccepted) {
            throw new common_1.BadRequestException('You have already accepted this venture');
        }
        collaborator.hasAccepted = true;
        const allAccepted = venture.collaborators.every(c => c.hasAccepted);
        if (allAccepted) {
            venture.status = 'active';
            this.logger.log(`Venture ${ventureId} is now active - all collaborators accepted`);
        }
        await venture.save();
        return venture;
    }
    async rejectVenture(ventureId, walletAddress) {
        const venture = await this.ventureModel.findById(ventureId);
        if (!venture) {
            throw new common_1.NotFoundException('Venture not found');
        }
        const collaborator = venture.collaborators.find(c => c.walletAddress === walletAddress);
        if (!collaborator) {
            throw new common_1.BadRequestException('You are not a collaborator in this venture');
        }
        venture.status = 'rejected';
        await venture.save();
        this.logger.log(`Venture ${ventureId} rejected by ${walletAddress}`);
        return venture;
    }
    async splitRevenue(ventureId, totalAmount, source, sender) {
        const venture = await this.ventureModel.findById(ventureId);
        if (!venture) {
            throw new common_1.NotFoundException('Venture not found');
        }
        if (venture.status !== 'active') {
            throw new common_1.BadRequestException('Venture must be active to split revenue');
        }
        const payments = venture.collaborators.map(collaborator => ({
            walletAddress: collaborator.walletAddress,
            amount: Math.floor((totalAmount * collaborator.sharePercentage) / 100),
            sharePercentage: collaborator.sharePercentage,
        }));
        const revenueSplit = new this.revenueSplitModel({
            ventureId,
            postId: venture.postId,
            totalAmount,
            source,
            payments,
            sender,
        });
        await revenueSplit.save();
        venture.totalRevenueGenerated += totalAmount;
        venture.totalSplits += 1;
        await venture.save();
        this.logger.log(`Revenue split: ${totalAmount} tokens from ${source} distributed among ${payments.length} collaborators`);
        return revenueSplit;
    }
    async getVentureByPostId(postId) {
        return this.ventureModel.findOne({ postId }).populate('postId');
    }
    async getUserVentures(walletAddress) {
        return this.ventureModel.find({
            $or: [
                { initiator: walletAddress },
                { 'collaborators.walletAddress': walletAddress },
            ],
        }).populate('postId').sort({ createdAt: -1 });
    }
    async getPendingInvitations(walletAddress) {
        return this.ventureModel.find({
            status: 'pending',
            'collaborators': {
                $elemMatch: {
                    walletAddress,
                    hasAccepted: false,
                },
            },
        }).populate('postId').sort({ createdAt: -1 });
    }
    async getVentureSplitHistory(ventureId) {
        return this.revenueSplitModel.find({ ventureId }).sort({ createdAt: -1 });
    }
    async getUserVentureEarnings(walletAddress) {
        const splits = await this.revenueSplitModel.find({
            'payments.walletAddress': walletAddress,
        });
        let totalEarnings = 0;
        let earningsBySource = {
            tip: 0,
            'nft-sale': 0,
            royalty: 0,
            other: 0,
        };
        splits.forEach(split => {
            const payment = split.payments.find(p => p.walletAddress === walletAddress);
            if (payment) {
                totalEarnings += payment.amount;
                earningsBySource[split.source] += payment.amount;
            }
        });
        return {
            totalEarnings,
            earningsBySource,
            totalSplits: splits.length,
        };
    }
    async getVentureStats() {
        const totalVentures = await this.ventureModel.countDocuments();
        const activeVentures = await this.ventureModel.countDocuments({ status: 'active' });
        const pendingVentures = await this.ventureModel.countDocuments({ status: 'pending' });
        const revenueStats = await this.revenueSplitModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalSplits: { $sum: 1 },
                },
            },
        ]);
        return {
            totalVentures,
            activeVentures,
            pendingVentures,
            totalRevenue: revenueStats[0]?.totalRevenue || 0,
            totalSplits: revenueStats[0]?.totalSplits || 0,
        };
    }
};
exports.VenturesService = VenturesService;
exports.VenturesService = VenturesService = VenturesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(venture_schema_1.Venture.name)),
    __param(1, (0, mongoose_1.InjectModel)(revenue_split_schema_1.RevenueSplit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VenturesService);
//# sourceMappingURL=ventures.service.js.map