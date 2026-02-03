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
var TippingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TippingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const web3_js_1 = require("@solana/web3.js");
const tip_schema_1 = require("./tip.schema");
const tipping_config_1 = require("./tipping.config");
let TippingService = TippingService_1 = class TippingService {
    tipModel;
    configService;
    logger = new common_1.Logger(TippingService_1.name);
    solanaConnection;
    constructor(tipModel, configService) {
        this.tipModel = tipModel;
        this.configService = configService;
        const rpcUrl = this.configService.get('SOLANA_RPC_URL');
        this.solanaConnection = new web3_js_1.Connection(rpcUrl || 'https://api.devnet.solana.com');
    }
    async createTip(fromWallet, createTipDto) {
        const { toWallet, amount, currency, postId, commentId, message } = createTipDto;
        if (fromWallet === toWallet) {
            throw new common_1.BadRequestException('You cannot tip yourself');
        }
        const validation = tipping_config_1.TIPPING_CONFIG.isValidTipAmount(amount);
        if (!validation.valid) {
            throw new common_1.BadRequestException(validation.error);
        }
        const { totalFee, burned, toRewards, feePercentage } = tipping_config_1.TIPPING_CONFIG.calculateFee(amount);
        this.logger.log(`Tip: ${amount} ${currency} | Fee: ${totalFee} (${feePercentage}%) | Burned: ${burned} 🔥 | Rewards: ${toRewards}`);
        const txSignature = await this.sendTipTransaction(fromWallet, toWallet, amount, currency);
        const tip = await this.tipModel.create({
            fromWallet,
            toWallet,
            amount,
            currency,
            platformFee: totalFee,
            feePercentage,
            amountBurned: burned,
            amountToRewards: toRewards,
            transactionSignature: txSignature,
            ...(postId && { postId }),
            ...(commentId && { commentId }),
            ...(message && { message }),
            status: 'completed',
            tippedAt: new Date(),
        });
        return tip;
    }
    async getSentTips(walletAddress, page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const tips = await this.tipModel
            .find({ fromWallet: walletAddress })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalSent = await this.tipModel
            .aggregate([
            { $match: { fromWallet: walletAddress } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
            .exec();
        return {
            totalSent: totalSent[0]?.total || 0,
            tips,
        };
    }
    async getReceivedTips(walletAddress, page = 1, limit = 30) {
        const skip = (page - 1) * limit;
        const tips = await this.tipModel
            .find({ toWallet: walletAddress })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalReceived = await this.tipModel
            .aggregate([
            { $match: { toWallet: walletAddress } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
            .exec();
        return {
            totalReceived: totalReceived[0]?.total || 0,
            tips,
        };
    }
    async getPostTips(postId) {
        const tips = await this.tipModel
            .find({ postId, status: 'completed' })
            .sort({ createdAt: -1 })
            .exec();
        const totalTipped = tips.reduce((sum, tip) => sum + tip.amount, 0);
        return {
            totalTipped,
            tipsCount: tips.length,
            tips,
        };
    }
    async getPlatformStats() {
        const stats = await this.tipModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalTips: { $sum: '$amount' },
                    totalFees: { $sum: '$platformFee' },
                    totalBurned: { $sum: '$amountBurned' },
                    totalToRewards: { $sum: '$amountToRewards' },
                    tipsCount: { $sum: 1 },
                },
            },
        ]);
        return stats[0] || {
            totalTips: 0,
            totalFees: 0,
            totalBurned: 0,
            totalToRewards: 0,
            tipsCount: 0,
        };
    }
    calculateFeePreview(amount) {
        const validation = tipping_config_1.TIPPING_CONFIG.isValidTipAmount(amount);
        if (!validation.valid) {
            return {
                valid: false,
                error: validation.error,
            };
        }
        const { totalFee, burned, toRewards, feePercentage } = tipping_config_1.TIPPING_CONFIG.calculateFee(amount);
        const recipientReceives = amount - totalFee;
        return {
            valid: true,
            amount,
            recipientReceives,
            fee: {
                total: totalFee,
                percentage: feePercentage,
                burned,
                toRewards,
            },
            tier: tipping_config_1.TIPPING_CONFIG.getTierName(amount),
        };
    }
    async sendTipTransaction(fromWallet, toWallet, amount, currency) {
        this.logger.log(`[MOCK] Sending ${amount} ${currency} from ${fromWallet} to ${toWallet}`);
        const mockSignature = `tip_tx_${Date.now()}_${fromWallet.slice(0, 8)}`;
        return mockSignature;
    }
};
exports.TippingService = TippingService;
exports.TippingService = TippingService = TippingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tip_schema_1.Tip.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], TippingService);
//# sourceMappingURL=tipping.service.js.map