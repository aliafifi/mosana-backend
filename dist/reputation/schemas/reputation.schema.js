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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationSchema = exports.Reputation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Reputation = class Reputation {
    walletAddress;
    totalScore;
    level;
    breakdown;
    metrics;
    penalties;
    badges;
    lastCalculated;
    firstActivity;
    rewardMultiplier;
    isFlagged;
    flagReason;
    calculationCount;
};
exports.Reputation = Reputation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Reputation.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 1000, index: true }),
    __metadata("design:type", Number)
], Reputation.prototype, "totalScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['New', 'Active', 'Trusted', 'Veteran', 'Legend'],
        default: 'New',
        index: true,
    }),
    __metadata("design:type", String)
], Reputation.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            accountAge: { points: 0, maxPoints: 100 },
            engagement: { points: 0, maxPoints: 250 },
            economic: { points: 0, maxPoints: 200 },
            socialGood: { points: 0, maxPoints: 150 },
            dao: { points: 0, maxPoints: 100 },
            nft: { points: 0, maxPoints: 100 },
            trust: { points: 0, maxPoints: 100 },
        },
    }),
    __metadata("design:type", Object)
], Reputation.prototype, "breakdown", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            totalPosts: 0,
            totalLikes: 0,
            totalComments: 0,
            tipsReceived: 0,
            tipsSent: 0,
            nftsMinted: 0,
            nftsSold: 0,
            nftRevenue: 0,
            charityDonations: 0,
            daosJoined: 0,
            proposalsCreated: 0,
            votesCast: 0,
            venturesJoined: 0,
        },
    }),
    __metadata("design:type", Object)
], Reputation.prototype, "metrics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], Reputation.prototype, "penalties", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Reputation.prototype, "badges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Reputation.prototype, "lastCalculated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Reputation.prototype, "firstActivity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1.0, min: 0, max: 5 }),
    __metadata("design:type", Number)
], Reputation.prototype, "rewardMultiplier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Reputation.prototype, "isFlagged", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reputation.prototype, "flagReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Reputation.prototype, "calculationCount", void 0);
exports.Reputation = Reputation = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'reputations',
    })
], Reputation);
exports.ReputationSchema = mongoose_1.SchemaFactory.createForClass(Reputation);
exports.ReputationSchema.index({ totalScore: -1 });
exports.ReputationSchema.index({ level: 1, totalScore: -1 });
exports.ReputationSchema.index({ isFlagged: 1 });
exports.ReputationSchema.index({ walletAddress: 1, lastCalculated: -1 });
//# sourceMappingURL=reputation.schema.js.map