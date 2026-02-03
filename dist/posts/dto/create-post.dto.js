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
exports.CreatePostDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePostDto {
    content;
    mediaUrls;
    tags;
    dedicatedCause;
    charityPercentage;
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Post content cannot be empty' }),
    (0, class_validator_1.MaxLength)(5000, { message: 'Post content cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreatePostDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10, { message: 'Cannot upload more than 10 media files' }),
    (0, class_validator_1.IsUrl)({}, { each: true, message: 'Each media URL must be valid' }),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "mediaUrls", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10, { message: 'Cannot add more than 10 tags' }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(30, { each: true, message: 'Each tag cannot exceed 30 characters' }),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)({ message: 'Invalid charity ID' }),
    __metadata("design:type", String)
], CreatePostDto.prototype, "dedicatedCause", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Charity percentage cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Charity percentage cannot exceed 100%' }),
    __metadata("design:type", Number)
], CreatePostDto.prototype, "charityPercentage", void 0);
//# sourceMappingURL=create-post.dto.js.map