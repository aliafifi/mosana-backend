"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TippingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const tipping_controller_1 = require("./tipping.controller");
const tipping_service_1 = require("./tipping.service");
const tip_schema_1 = require("./tip.schema");
const auth_module_1 = require("../auth/auth.module");
let TippingModule = class TippingModule {
};
exports.TippingModule = TippingModule;
exports.TippingModule = TippingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: tip_schema_1.Tip.name, schema: tip_schema_1.TipSchema }]),
            config_1.ConfigModule,
            auth_module_1.AuthModule,
        ],
        controllers: [tipping_controller_1.TippingController],
        providers: [tipping_service_1.TippingService],
        exports: [tipping_service_1.TippingService],
    })
], TippingModule);
//# sourceMappingURL=tipping.module.js.map