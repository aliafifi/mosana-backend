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
var DaoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dao_schema_1 = require("./schemas/dao.schema");
const proposal_schema_1 = require("./schemas/proposal.schema");
let DaoService = DaoService_1 = class DaoService {
    daoModel;
    proposalModel;
    logger = new common_1.Logger(DaoService_1.name);
    constructor(daoModel, proposalModel) {
        this.daoModel = daoModel;
        this.proposalModel = proposalModel;
    }
    async createDao(createDaoDto, creatorWallet) {
        this.logger.log(`Creating DAO: ${createDaoDto.name} by ${creatorWallet}`);
        const dao = new this.daoModel({
            ...createDaoDto,
            creator: creatorWallet,
            members: [creatorWallet],
            memberCount: 1,
            settings: {
                allowProposalsFrom: createDaoDto.allowProposalsFrom || 'members',
                minTokensToPropose: createDaoDto.minTokensToPropose || 0,
                minReputationToPropose: 0,
            },
        });
        await dao.save();
        this.logger.log(`DAO created: ${dao._id}`);
        return dao;
    }
    async getDaoById(daoId) {
        if (!mongoose_2.Types.ObjectId.isValid(daoId)) {
            throw new common_1.BadRequestException('Invalid DAO ID');
        }
        const dao = await this.daoModel.findById(daoId);
        if (!dao) {
            throw new common_1.NotFoundException('DAO not found');
        }
        return dao;
    }
    async getAllDaos(status, sortBy = 'memberCount') {
        const query = {};
        if (status) {
            query.status = status;
        }
        const sortOptions = {};
        if (sortBy === 'memberCount') {
            sortOptions.memberCount = -1;
        }
        else if (sortBy === 'newest') {
            sortOptions.createdAt = -1;
        }
        else {
            sortOptions.memberCount = -1;
        }
        return this.daoModel.find(query).sort(sortOptions).exec();
    }
    async getUserDaos(walletAddress) {
        return this.daoModel
            .find({ members: walletAddress })
            .sort({ createdAt: -1 })
            .exec();
    }
    async joinDao(daoId, walletAddress) {
        const dao = await this.getDaoById(daoId);
        if (dao.members.includes(walletAddress)) {
            throw new common_1.BadRequestException('You are already a member of this DAO');
        }
        dao.members.push(walletAddress);
        dao.memberCount = dao.members.length;
        await dao.save();
        this.logger.log(`User ${walletAddress} joined DAO ${daoId}`);
        return dao;
    }
    async leaveDao(daoId, walletAddress) {
        const dao = await this.getDaoById(daoId);
        if (dao.creator === walletAddress) {
            throw new common_1.BadRequestException('DAO creator cannot leave');
        }
        if (!dao.members.includes(walletAddress)) {
            throw new common_1.BadRequestException('You are not a member of this DAO');
        }
        dao.members = dao.members.filter(member => member !== walletAddress);
        dao.memberCount = dao.members.length;
        await dao.save();
        this.logger.log(`User ${walletAddress} left DAO ${daoId}`);
        return dao;
    }
    async createProposal(daoId, createProposalDto, proposerWallet) {
        const dao = await this.getDaoById(daoId);
        const canPropose = await this.canUserPropose(dao, proposerWallet);
        if (!canPropose) {
            throw new common_1.ForbiddenException('You do not have permission to create proposals in this DAO');
        }
        const votingStartsAt = new Date();
        const votingEndsAt = new Date();
        votingEndsAt.setDate(votingEndsAt.getDate() + dao.votingPeriodDays);
        const proposal = new this.proposalModel({
            daoId: dao._id,
            title: createProposalDto.title,
            description: createProposalDto.description,
            proposer: proposerWallet,
            votingStartsAt,
            votingEndsAt,
            metadata: {
                category: createProposalDto.category || 'other',
                attachments: createProposalDto.attachments || [],
                discussionUrl: createProposalDto.discussionUrl || null,
            },
        });
        await proposal.save();
        dao.proposalCount++;
        await dao.save();
        this.logger.log(`Proposal created: ${proposal._id} in DAO ${daoId}`);
        return proposal;
    }
    async getProposalById(proposalId) {
        if (!mongoose_2.Types.ObjectId.isValid(proposalId)) {
            throw new common_1.BadRequestException('Invalid proposal ID');
        }
        const proposal = await this.proposalModel.findById(proposalId).populate('daoId');
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        return proposal;
    }
    async getDaoProposals(daoId, status) {
        const query = { daoId };
        if (status) {
            query.status = status;
        }
        return this.proposalModel
            .find(query)
            .sort({ createdAt: -1 })
            .exec();
    }
    async castVote(proposalId, castVoteDto, voterWallet) {
        const proposal = await this.getProposalById(proposalId);
        if (proposal.status !== 'active') {
            throw new common_1.BadRequestException('Proposal is not active');
        }
        if (new Date() > proposal.votingEndsAt) {
            throw new common_1.BadRequestException('Voting period has ended');
        }
        const dao = await this.getDaoById(proposal.daoId.toString());
        if (!dao.members.includes(voterWallet)) {
            throw new common_1.ForbiddenException('Only DAO members can vote');
        }
        const existingVote = proposal.votes.find(v => v.walletAddress === voterWallet);
        if (existingVote) {
            throw new common_1.BadRequestException('You have already voted on this proposal');
        }
        const vote = {
            walletAddress: voterWallet,
            vote: castVoteDto.vote,
            weight: 1,
            votedAt: new Date(),
        };
        proposal.votes.push(vote);
        proposal.totalVotes++;
        if (castVoteDto.vote === 'yes') {
            proposal.yesVotes++;
        }
        else if (castVoteDto.vote === 'no') {
            proposal.noVotes++;
        }
        else {
            proposal.abstainVotes++;
        }
        proposal.participationRate = (proposal.totalVotes / dao.memberCount) * 100;
        await proposal.save();
        this.logger.log(`Vote cast: ${voterWallet} voted ${castVoteDto.vote} on proposal ${proposalId}`);
        await this.checkAndFinalizeProposal(proposal, dao);
        return proposal;
    }
    async getUserVoteOnProposal(proposalId, walletAddress) {
        const proposal = await this.getProposalById(proposalId);
        const vote = proposal.votes.find(v => v.walletAddress === walletAddress);
        return vote || null;
    }
    async canUserPropose(dao, walletAddress) {
        const settings = dao.settings;
        if (settings.allowProposalsFrom === 'creator') {
            return dao.creator === walletAddress;
        }
        if (settings.allowProposalsFrom === 'members') {
            return dao.members.includes(walletAddress);
        }
        return true;
    }
    async checkAndFinalizeProposal(proposal, dao) {
        const now = new Date();
        if (now > proposal.votingEndsAt && proposal.status === 'active') {
            await this.finalizeProposal(proposal, dao);
        }
    }
    async finalizeProposal(proposal, dao) {
        const quorumMet = proposal.participationRate >= dao.quorumPercentage;
        if (!quorumMet) {
            proposal.status = 'expired';
            this.logger.log(`Proposal ${proposal._id} expired - quorum not met`);
        }
        else {
            if (proposal.yesVotes > proposal.noVotes) {
                proposal.status = 'passed';
                this.logger.log(`Proposal ${proposal._id} PASSED`);
            }
            else {
                proposal.status = 'rejected';
                this.logger.log(`Proposal ${proposal._id} REJECTED`);
            }
        }
        await proposal.save();
    }
    async getDaoStats(daoId) {
        const dao = await this.getDaoById(daoId);
        const proposals = await this.proposalModel.find({ daoId }).exec();
        const activeProposals = proposals.filter(p => p.status === 'active').length;
        const passedProposals = proposals.filter(p => p.status === 'passed').length;
        const rejectedProposals = proposals.filter(p => p.status === 'rejected').length;
        const avgParticipation = proposals.length > 0
            ? proposals.reduce((sum, p) => sum + p.participationRate, 0) / proposals.length
            : 0;
        return {
            memberCount: dao.memberCount,
            proposalCount: dao.proposalCount,
            activeProposals,
            passedProposals,
            rejectedProposals,
            avgParticipationRate: Math.round(avgParticipation * 100) / 100,
            treasuryBalance: dao.treasuryBalance,
        };
    }
    async getPlatformStats() {
        const totalDaos = await this.daoModel.countDocuments();
        const activeDaos = await this.daoModel.countDocuments({ status: 'active' });
        const totalProposals = await this.proposalModel.countDocuments();
        const activeProposals = await this.proposalModel.countDocuments({ status: 'active' });
        const allDaos = await this.daoModel.find();
        const uniqueMembers = new Set();
        allDaos.forEach(dao => {
            dao.members.forEach(member => uniqueMembers.add(member));
        });
        return {
            totalDaos,
            activeDaos,
            totalProposals,
            activeProposals,
            totalMembers: uniqueMembers.size,
        };
    }
};
exports.DaoService = DaoService;
exports.DaoService = DaoService = DaoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dao_schema_1.Dao.name)),
    __param(1, (0, mongoose_1.InjectModel)(proposal_schema_1.Proposal.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DaoService);
//# sourceMappingURL=dao.service.js.map