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
exports.TipSchema = exports.Tip = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Tip = class Tip {
    fromWallet;
    toWallet;
    amount;
    currency;
    platformFee;
    feePercentage;
    amountBurned;
    amountToRewards;
    transactionSignature;
    postId;
    commentId;
    message;
    status;
    tippedAt;
};
exports.Tip = Tip;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Tip.prototype, "fromWallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Tip.prototype, "toWallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Tip.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tip.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tip.prototype, "platformFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tip.prototype, "feePercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tip.prototype, "amountBurned", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tip.prototype, "amountToRewards", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tip.prototype, "transactionSignature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Tip.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Tip.prototype, "commentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Tip.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'completed' }),
    __metadata("design:type", String)
], Tip.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Tip.prototype, "tippedAt", void 0);
exports.Tip = Tip = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Tip);
exports.TipSchema = mongoose_1.SchemaFactory.createForClass(Tip);
exports.TipSchema.index({ fromWallet: 1, createdAt: -1 });
exports.TipSchema.index({ toWallet: 1, createdAt: -1 });
exports.TipSchema.index({ postId: 1 });
exports.TipSchema.index({ transactionSignature: 1 }, { unique: true });
//# sourceMappingURL=tip.schema.js.map