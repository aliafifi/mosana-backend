"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenturesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ventures_service_1 = require("./ventures.service");
const ventures_controller_1 = require("./ventures.controller");
const venture_schema_1 = require("./schemas/venture.schema");
const revenue_split_schema_1 = require("./schemas/revenue-split.schema");
const reputation_module_1 = require("../reputation/reputation.module");
let VenturesModule = class VenturesModule {
};
exports.VenturesModule = VenturesModule;
exports.VenturesModule = VenturesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: venture_schema_1.Venture.name, schema: venture_schema_1.VentureSchema },
                { name: revenue_split_schema_1.RevenueSplit.name, schema: revenue_split_schema_1.RevenueSplitSchema },
            ]),
            reputation_module_1.ReputationModule,
        ],
        controllers: [ventures_controller_1.VenturesController],
        providers: [ventures_service_1.VenturesService],
        exports: [ventures_service_1.VenturesService],
    })
], VenturesModule);
//# sourceMappingURL=ventures.module.js.map