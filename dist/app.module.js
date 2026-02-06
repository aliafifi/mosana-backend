"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const posts_module_1 = require("./posts/posts.module");
const rewards_module_1 = require("./rewards/rewards.module");
const tipping_module_1 = require("./tipping/tipping.module");
const nft_minting_module_1 = require("./nft-minting/nft-minting.module");
const ventures_module_1 = require("./ventures/ventures.module");
const social_good_module_1 = require("./social-good/social-good.module");
const dao_module_1 = require("./dao/dao.module");
const reputation_module_1 = require("./reputation/reputation.module");
const verification_module_1 = require("./verification/verification.module");
const export_module_1 = require("./export/export.module");
const notifications_module_1 = require("./notifications/notifications.module");
const firebase_module_1 = require("./firebase/firebase.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/mosana'),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            posts_module_1.PostsModule,
            rewards_module_1.RewardsModule,
            tipping_module_1.TippingModule,
            nft_minting_module_1.NftMintingModule,
            ventures_module_1.VenturesModule,
            social_good_module_1.SocialGoodModule,
            dao_module_1.DaoModule,
            reputation_module_1.ReputationModule,
            verification_module_1.VerificationModule,
            export_module_1.ExportModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map