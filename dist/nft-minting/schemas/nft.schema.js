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
exports.NftSchema = exports.Nft = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Nft = class Nft {
    postId;
    mintAddress;
    metadataUri;
    creator;
    owner;
    royaltyPercentage;
    isBurned;
    transactionHash;
    engagementSnapshot;
};
exports.Nft = Nft;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Nft.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Nft.prototype, "mintAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Nft.prototype, "metadataUri", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Nft.prototype, "creator", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Nft.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default: 5,
        min: 0,
        max: 50
    }),
    __metadata("design:type", Number)
], Nft.prototype, "royaltyPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Nft.prototype, "isBurned", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Nft.prototype, "transactionHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Nft.prototype, "engagementSnapshot", void 0);
exports.Nft = Nft = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Nft);
exports.NftSchema = mongoose_1.SchemaFactory.createForClass(Nft);
exports.NftSchema.index({ creator: 1, createdAt: -1 });
exports.NftSchema.index({ postId: 1 });
//# sourceMappingURL=nft.schema.js.map