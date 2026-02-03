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
exports.CreateDaoDto = void 0;
const class_validator_1 = require("class-validator");
class CreateDaoDto {
    name;
    description;
    logoUrl;
    minTokensRequired;
    votingPeriodDays;
    quorumPercentage;
    allowProposalsFrom;
    minTokensToPropose;
    tags;
}
exports.CreateDaoDto = CreateDaoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'DAO name is required' }),
    __metadata("design:type", String)
], CreateDaoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    __metadata("design:type", String)
], CreateDaoDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Logo must be a valid URL' }),
    __metadata("design:type", String)
], CreateDaoDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100, { message: 'Minimum tokens must be at least 100' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDaoDto.prototype, "minTokensRequired", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Voting period must be at least 1 day' }),
    (0, class_validator_1.Max)(30, { message: 'Voting period cannot exceed 30 days' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDaoDto.prototype, "votingPeriodDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Quorum must be at least 1%' }),
    (0, class_validator_1.Max)(100, { message: 'Quorum cannot exceed 100%' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDaoDto.prototype, "quorumPercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['anyone', 'members', 'creator']),
    __metadata("design:type", String)
], CreateDaoDto.prototype, "allowProposalsFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDaoDto.prototype, "minTokensToPropose", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDaoDto.prototype, "tags", void 0);
//# sourceMappingURL=create-dao.dto.js.map