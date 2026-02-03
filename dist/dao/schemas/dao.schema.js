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
exports.DaoSchema = exports.Dao = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Dao = class Dao {
    name;
    description;
    logoUrl;
    creator;
    minTokensRequired;
    members;
    memberCount;
    proposalCount;
    status;
    votingPeriodDays;
    quorumPercentage;
    reputationWeighted;
    settings;
    treasuryBalance;
    tags;
};
exports.Dao = Dao;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Dao.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Dao.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Dao.prototype, "logoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Dao.prototype, "creator", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 1000 }),
    __metadata("design:type", Number)
], Dao.prototype, "minTokensRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Dao.prototype, "members", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dao.prototype, "memberCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dao.prototype, "proposalCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    }),
    __metadata("design:type", String)
], Dao.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 7 }),
    __metadata("design:type", Number)
], Dao.prototype, "votingPeriodDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 51 }),
    __metadata("design:type", Number)
], Dao.prototype, "quorumPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Dao.prototype, "reputationWeighted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Dao.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Dao.prototype, "treasuryBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Dao.prototype, "tags", void 0);
exports.Dao = Dao = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Dao);
exports.DaoSchema = mongoose_1.SchemaFactory.createForClass(Dao);
exports.DaoSchema.index({ creator: 1, createdAt: -1 });
exports.DaoSchema.index({ status: 1, memberCount: -1 });
exports.DaoSchema.index({ members: 1 });
exports.DaoSchema.index({ tags: 1 });
//# sourceMappingURL=dao.schema.js.map