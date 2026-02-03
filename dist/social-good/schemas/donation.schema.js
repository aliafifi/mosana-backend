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
exports.DonationSchema = exports.Donation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Donation = class Donation {
    donorWallet;
    causeId;
    amount;
    pledgePercentage;
    source;
    originalAmount;
    sourceTransactionId;
    donationTransactionHash;
};
exports.Donation = Donation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Donation.prototype, "donorWallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Cause', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Donation.prototype, "causeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Donation.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Donation.prototype, "pledgePercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Donation.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Donation.prototype, "originalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Donation.prototype, "sourceTransactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Donation.prototype, "donationTransactionHash", void 0);
exports.Donation = Donation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Donation);
exports.DonationSchema = mongoose_1.SchemaFactory.createForClass(Donation);
exports.DonationSchema.index({ donorWallet: 1, createdAt: -1 });
exports.DonationSchema.index({ causeId: 1, createdAt: -1 });
//# sourceMappingURL=donation.schema.js.map