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
exports.VentureSchema = exports.Venture = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class Collaborator {
    walletAddress;
    sharePercentage;
    hasAccepted;
}
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Collaborator.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Collaborator.prototype, "sharePercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Collaborator.prototype, "hasAccepted", void 0);
let Venture = class Venture {
    postId;
    initiator;
    collaborators;
    status;
    totalRevenueGenerated;
    totalSplits;
    description;
};
exports.Venture = Venture;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Post', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Venture.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Venture.prototype, "initiator", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Collaborator], required: true }),
    __metadata("design:type", Array)
], Venture.prototype, "collaborators", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'active', 'rejected', 'completed'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], Venture.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Venture.prototype, "totalRevenueGenerated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Venture.prototype, "totalSplits", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Venture.prototype, "description", void 0);
exports.Venture = Venture = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Venture);
exports.VentureSchema = mongoose_1.SchemaFactory.createForClass(Venture);
exports.VentureSchema.index({ initiator: 1, createdAt: -1 });
exports.VentureSchema.index({ 'collaborators.walletAddress': 1 });
exports.VentureSchema.index({ status: 1 });
//# sourceMappingURL=venture.schema.js.map