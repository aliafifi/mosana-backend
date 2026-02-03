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
exports.RewardSchema = exports.Reward = exports.DailyEngagementSchema = exports.DailyEngagement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let DailyEngagement = class DailyEngagement {
    walletAddress;
    date;
    postsCreated;
    likesReceived;
    commentsReceived;
    viewsReceived;
    likesGiven;
    commentsGiven;
    totalPoints;
    tokensEarned;
    isDistributed;
};
exports.DailyEngagement = DailyEngagement;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], DailyEngagement.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DailyEngagement.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "postsCreated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "likesReceived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "commentsReceived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "viewsReceived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "likesGiven", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "commentsGiven", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "totalPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DailyEngagement.prototype, "tokensEarned", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEngagement.prototype, "isDistributed", void 0);
exports.DailyEngagement = DailyEngagement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DailyEngagement);
exports.DailyEngagementSchema = mongoose_1.SchemaFactory.createForClass(DailyEngagement);
let Reward = class Reward {
    walletAddress;
    amount;
    date;
    engagementPoints;
    transactionSignature;
    status;
};
exports.Reward = Reward;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Reward.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Reward.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Reward.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Reward.prototype, "engagementPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reward.prototype, "transactionSignature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'completed' }),
    __metadata("design:type", String)
], Reward.prototype, "status", void 0);
exports.Reward = Reward = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reward);
exports.RewardSchema = mongoose_1.SchemaFactory.createForClass(Reward);
exports.DailyEngagementSchema.index({ walletAddress: 1, date: -1 });
exports.DailyEngagementSchema.index({ date: -1, isDistributed: 1 });
exports.RewardSchema.index({ walletAddress: 1, date: -1 });
//# sourceMappingURL=reward.schema.js.map