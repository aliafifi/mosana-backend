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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoController = void 0;
const common_1 = require("@nestjs/common");
const dao_service_1 = require("./dao.service");
const create_dao_dto_1 = require("./dto/create-dao.dto");
const create_proposal_dto_1 = require("./dto/create-proposal.dto");
const cast_vote_dto_1 = require("./dto/cast-vote.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let DaoController = class DaoController {
    daoService;
    constructor(daoService) {
        this.daoService = daoService;
    }
    async createDao(createDaoDto, req) {
        try {
            const dao = await this.daoService.createDao(createDaoDto, req.user.walletAddress);
            return {
                success: true,
                message: 'DAO created successfully',
                data: dao,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getAllDaos(status, sortBy) {
        try {
            const daos = await this.daoService.getAllDaos(status, sortBy);
            return {
                success: true,
                count: daos.length,
                data: daos,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getDaoById(daoId) {
        try {
            const dao = await this.daoService.getDaoById(daoId);
            return {
                success: true,
                data: dao,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getMyDaos(req) {
        try {
            const daos = await this.daoService.getUserDaos(req.user.walletAddress);
            return {
                success: true,
                count: daos.length,
                data: daos,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async joinDao(daoId, req) {
        try {
            const dao = await this.daoService.joinDao(daoId, req.user.walletAddress);
            return {
                success: true,
                message: 'Successfully joined DAO',
                data: dao,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async leaveDao(daoId, req) {
        try {
            const dao = await this.daoService.leaveDao(daoId, req.user.walletAddress);
            return {
                success: true,
                message: 'Successfully left DAO',
                data: dao,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async createProposal(daoId, createProposalDto, req) {
        try {
            const proposal = await this.daoService.createProposal(daoId, createProposalDto, req.user.walletAddress);
            return {
                success: true,
                message: 'Proposal created successfully',
                data: proposal,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getDaoProposals(daoId, status) {
        try {
            const proposals = await this.daoService.getDaoProposals(daoId, status);
            return {
                success: true,
                count: proposals.length,
                data: proposals,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getProposalById(proposalId) {
        try {
            const proposal = await this.daoService.getProposalById(proposalId);
            return {
                success: true,
                data: proposal,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async castVote(proposalId, castVoteDto, req) {
        try {
            const proposal = await this.daoService.castVote(proposalId, castVoteDto, req.user.walletAddress);
            return {
                success: true,
                message: 'Vote cast successfully',
                data: proposal,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getMyVote(proposalId, req) {
        try {
            const vote = await this.daoService.getUserVoteOnProposal(proposalId, req.user.walletAddress);
            return {
                success: true,
                data: vote,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getDaoStats(daoId) {
        try {
            const stats = await this.daoService.getDaoStats(daoId);
            return {
                success: true,
                data: stats,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getPlatformStats() {
        try {
            const stats = await this.daoService.getPlatformStats();
            return {
                success: true,
                data: stats,
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.DaoController = DaoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dao_dto_1.CreateDaoDto, Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "createDao", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('sortBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getAllDaos", null);
__decorate([
    (0, common_1.Get)(':daoId'),
    __param(0, (0, common_1.Param)('daoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getDaoById", null);
__decorate([
    (0, common_1.Get)('my/daos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getMyDaos", null);
__decorate([
    (0, common_1.Post)(':daoId/join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('daoId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "joinDao", null);
__decorate([
    (0, common_1.Delete)(':daoId/leave'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('daoId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "leaveDao", null);
__decorate([
    (0, common_1.Post)(':daoId/proposals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('daoId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_proposal_dto_1.CreateProposalDto, Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "createProposal", null);
__decorate([
    (0, common_1.Get)(':daoId/proposals'),
    __param(0, (0, common_1.Param)('daoId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getDaoProposals", null);
__decorate([
    (0, common_1.Get)(':daoId/proposals/:proposalId'),
    __param(0, (0, common_1.Param)('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getProposalById", null);
__decorate([
    (0, common_1.Post)(':daoId/proposals/:proposalId/vote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('proposalId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cast_vote_dto_1.CastVoteDto, Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "castVote", null);
__decorate([
    (0, common_1.Get)(':daoId/proposals/:proposalId/my-vote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('proposalId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getMyVote", null);
__decorate([
    (0, common_1.Get)(':daoId/stats'),
    __param(0, (0, common_1.Param)('daoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getDaoStats", null);
__decorate([
    (0, common_1.Get)('stats/platform'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DaoController.prototype, "getPlatformStats", null);
exports.DaoController = DaoController = __decorate([
    (0, common_1.Controller)('dao'),
    __metadata("design:paramtypes", [dao_service_1.DaoService])
], DaoController);
//# sourceMappingURL=dao.controller.js.map