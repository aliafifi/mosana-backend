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
exports.CreateTipDto = void 0;
const class_validator_1 = require("class-validator");
class CreateTipDto {
    toWallet;
    amount;
    currency;
    postId;
    commentId;
    message;
}
exports.CreateTipDto = CreateTipDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Recipient wallet address is required' }),
    __metadata("design:type", String)
], CreateTipDto.prototype, "toWallet", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10, { message: 'Minimum tip is 10 tokens' }),
    (0, class_validator_1.Max)(10_000_000, { message: 'Maximum tip is 10,000,000 tokens' }),
    __metadata("design:type", Number)
], CreateTipDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['MOSANA', 'SOL'], { message: 'Currency must be MOSANA or SOL' }),
    __metadata("design:type", String)
], CreateTipDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTipDto.prototype, "postId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTipDto.prototype, "commentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Message cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreateTipDto.prototype, "message", void 0);
//# sourceMappingURL=create-tip.dto.js.map