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
exports.ProposalSchema = exports.Proposal = exports.Vote = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Vote = class Vote {
    walletAddress;
    vote;
    weight;
    votedAt;
};
exports.Vote = Vote;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vote.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['yes', 'no', 'abstain'] }),
    __metadata("design:type", String)
], Vote.prototype, "vote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Vote.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Vote.prototype, "votedAt", void 0);
exports.Vote = Vote = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Vote);
let Proposal = class Proposal {
    daoId;
    title;
    description;
    proposer;
    status;
    votingStartsAt;
    votingEndsAt;
    votes;
    yesVotes;
    noVotes;
    abstainVotes;
    totalVotes;
    participationRate;
    executedAt;
    executedBy;
    executionTransactionHash;
    metadata;
};
exports.Proposal = Proposal;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Dao', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Proposal.prototype, "daoId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Proposal.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Proposal.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Proposal.prototype, "proposer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['active', 'passed', 'rejected', 'expired', 'executed'],
        default: 'active',
        index: true
    }),
    __metadata("design:type", String)
], Proposal.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Proposal.prototype, "votingStartsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], Proposal.prototype, "votingEndsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Vote], default: [] }),
    __metadata("design:type", Array)
], Proposal.prototype, "votes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Proposal.prototype, "yesVotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Proposal.prototype, "noVotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Proposal.prototype, "abstainVotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Proposal.prototype, "totalVotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Proposal.prototype, "participationRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Proposal.prototype, "executedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Proposal.prototype, "executedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Proposal.prototype, "executionTransactionHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Proposal.prototype, "metadata", void 0);
exports.Proposal = Proposal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Proposal);
exports.ProposalSchema = mongoose_1.SchemaFactory.createForClass(Proposal);
exports.ProposalSchema.index({ daoId: 1, createdAt: -1 });
exports.ProposalSchema.index({ proposer: 1, createdAt: -1 });
exports.ProposalSchema.index({ status: 1, votingEndsAt: 1 });
exports.ProposalSchema.index({ 'votes.walletAddress': 1 });
//# sourceMappingURL=proposal.schema.js.map