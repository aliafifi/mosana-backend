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
exports.SetNftPfpDto = void 0;
const class_validator_1 = require("class-validator");
class SetNftPfpDto {
    nftMintAddress;
}
exports.SetNftPfpDto = SetNftPfpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'NFT mint address is required' }),
    (0, class_validator_1.Length)(32, 44, { message: 'Invalid Solana address length' }),
    (0, class_validator_1.Matches)(/^[1-9A-HJ-NP-Za-km-z]+$/, {
        message: 'Invalid Solana address format (must be base58)',
    }),
    __metadata("design:type", String)
], SetNftPfpDto.prototype, "nftMintAddress", void 0);
//# sourceMappingURL=set-nft-pfp.dto.js.map