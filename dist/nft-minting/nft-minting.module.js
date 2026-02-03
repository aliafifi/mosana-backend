"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftMintingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const nft_minting_service_1 = require("./nft-minting.service");
const nft_minting_controller_1 = require("./nft-minting.controller");
const nft_schema_1 = require("./schemas/nft.schema");
const arweave_service_1 = require("./services/arweave.service");
const posts_module_1 = require("../posts/posts.module");
const users_module_1 = require("../users/users.module");
const post_schema_1 = require("../posts/post.schema");
let NftMintingModule = class NftMintingModule {
};
exports.NftMintingModule = NftMintingModule;
exports.NftMintingModule = NftMintingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: nft_schema_1.Nft.name, schema: nft_schema_1.NftSchema },
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema },
            ]),
            posts_module_1.PostsModule,
            users_module_1.UsersModule,
        ],
        providers: [
            nft_minting_service_1.NftMintingService,
            arweave_service_1.ArweaveService,
        ],
        controllers: [nft_minting_controller_1.NftMintingController],
        exports: [nft_minting_service_1.NftMintingService],
    })
], NftMintingModule);
//# sourceMappingURL=nft-minting.module.js.map