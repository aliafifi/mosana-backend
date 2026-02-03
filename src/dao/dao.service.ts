import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dao, DaoDocument } from './schemas/dao.schema';
import { Proposal, ProposalDocument } from './schemas/proposal.schema';
import { CreateDaoDto } from './dto/create-dao.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CastVoteDto } from './dto/cast-vote.dto';

@Injectable()
export class DaoService {
  private readonly logger = new Logger(DaoService.name);

  constructor(
    @InjectModel(Dao.name) private daoModel: Model<DaoDocument>,
    @InjectModel(Proposal.name) private proposalModel: Model<ProposalDocument>,
  ) {}

  // ============================================================================
  // DAO MANAGEMENT
  // ============================================================================

  async createDao(createDaoDto: CreateDaoDto, creatorWallet: string): Promise<DaoDocument> {
    this.logger.log(`Creating DAO: ${createDaoDto.name} by ${creatorWallet}`);

    const dao = new this.daoModel({
      ...createDaoDto,
      creator: creatorWallet,
      members: [creatorWallet], // Creator is first member
      memberCount: 1,
      settings: {
        allowProposalsFrom: createDaoDto.allowProposalsFrom || 'members',
        minTokensToPropose: createDaoDto.minTokensToPropose || 0,
        minReputationToPropose: 0, // For future reputation integration
      },
    });

    await dao.save();
    this.logger.log(`DAO created: ${dao._id}`);
    return dao;
  }

  async getDaoById(daoId: string): Promise<DaoDocument> {
    if (!Types.ObjectId.isValid(daoId)) {
      throw new BadRequestException('Invalid DAO ID');
    }

    const dao = await this.daoModel.findById(daoId);
    if (!dao) {
      throw new NotFoundException('DAO not found');
    }

    return dao;
  }

  async getAllDaos(
    status?: string,
    sortBy: string = 'memberCount',
  ): Promise<DaoDocument[]> {
    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    const sortOptions: any = {};
    if (sortBy === 'memberCount') {
      sortOptions.memberCount = -1;
    } else if (sortBy === 'newest') {
      sortOptions.createdAt = -1;
    } else {
      sortOptions.memberCount = -1; // Default
    }

    return this.daoModel.find(query).sort(sortOptions).exec();
  }

  async getUserDaos(walletAddress: string): Promise<DaoDocument[]> {
    return this.daoModel
      .find({ members: walletAddress })
      .sort({ createdAt: -1 })
      .exec();
  }

  async joinDao(daoId: string, walletAddress: string): Promise<DaoDocument> {
    const dao = await this.getDaoById(daoId);

    // Check if already a member
    if (dao.members.includes(walletAddress)) {
      throw new BadRequestException('You are already a member of this DAO');
    }

    // TODO: Check if user has required tokens (integrate with user balance later)
    // For now, we'll skip token validation

    dao.members.push(walletAddress);
    dao.memberCount = dao.members.length;
    await dao.save();

    this.logger.log(`User ${walletAddress} joined DAO ${daoId}`);
    return dao;
  }

  async leaveDao(daoId: string, walletAddress: string): Promise<DaoDocument> {
    const dao = await this.getDaoById(daoId);

    // Cannot leave if you're the creator
    if (dao.creator === walletAddress) {
      throw new BadRequestException('DAO creator cannot leave');
    }

    // Check if member
    if (!dao.members.includes(walletAddress)) {
      throw new BadRequestException('You are not a member of this DAO');
    }

    dao.members = dao.members.filter(member => member !== walletAddress);
    dao.memberCount = dao.members.length;
    await dao.save();

    this.logger.log(`User ${walletAddress} left DAO ${daoId}`);
    return dao;
  }

  // ============================================================================
  // PROPOSAL MANAGEMENT
  // ============================================================================

  async createProposal(
    daoId: string,
    createProposalDto: CreateProposalDto,
    proposerWallet: string,
  ): Promise<ProposalDocument> {
    const dao = await this.getDaoById(daoId);

    // Check if user can propose
    const canPropose = await this.canUserPropose(dao, proposerWallet);
    if (!canPropose) {
      throw new ForbiddenException('You do not have permission to create proposals in this DAO');
    }

    // Calculate voting period
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

    // Update DAO proposal count
    dao.proposalCount++;
    await dao.save();

    this.logger.log(`Proposal created: ${proposal._id} in DAO ${daoId}`);
    return proposal;
  }

  async getProposalById(proposalId: string): Promise<ProposalDocument> {
    if (!Types.ObjectId.isValid(proposalId)) {
      throw new BadRequestException('Invalid proposal ID');
    }

    const proposal = await this.proposalModel.findById(proposalId).populate('daoId');
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    return proposal;
  }

  async getDaoProposals(
    daoId: string,
    status?: string,
  ): Promise<ProposalDocument[]> {
    const query: any = { daoId };

    if (status) {
      query.status = status;
    }

    return this.proposalModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async castVote(
    proposalId: string,
    castVoteDto: CastVoteDto,
    voterWallet: string,
  ): Promise<ProposalDocument> {
    const proposal = await this.getProposalById(proposalId);

    // Check if proposal is active
    if (proposal.status !== 'active') {
      throw new BadRequestException('Proposal is not active');
    }

    // Check if voting period has ended
    if (new Date() > proposal.votingEndsAt) {
      throw new BadRequestException('Voting period has ended');
    }

    // Get DAO to check membership
    const dao = await this.getDaoById(proposal.daoId.toString());

    // Check if user is a member
    if (!dao.members.includes(voterWallet)) {
      throw new ForbiddenException('Only DAO members can vote');
    }

    // Check if user has already voted
    const existingVote = proposal.votes.find(v => v.walletAddress === voterWallet);
    if (existingVote) {
      throw new BadRequestException('You have already voted on this proposal');
    }

    // Add vote
    const vote = {
      walletAddress: voterWallet,
      vote: castVoteDto.vote,
      weight: 1, // For now, all votes are equal weight
      votedAt: new Date(),
    };

    proposal.votes.push(vote);
    proposal.totalVotes++;

    // Update vote counts
    if (castVoteDto.vote === 'yes') {
      proposal.yesVotes++;
    } else if (castVoteDto.vote === 'no') {
      proposal.noVotes++;
    } else {
      proposal.abstainVotes++;
    }

    // Calculate participation rate
    proposal.participationRate = (proposal.totalVotes / dao.memberCount) * 100;

    await proposal.save();

    this.logger.log(`Vote cast: ${voterWallet} voted ${castVoteDto.vote} on proposal ${proposalId}`);

    // Check if proposal should be finalized
    await this.checkAndFinalizeProposal(proposal, dao);

    return proposal;
  }

  async getUserVoteOnProposal(proposalId: string, walletAddress: string): Promise<any> {
    const proposal = await this.getProposalById(proposalId);
    const vote = proposal.votes.find(v => v.walletAddress === walletAddress);
    
    return vote || null;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async canUserPropose(dao: DaoDocument, walletAddress: string): Promise<boolean> {
    const settings = dao.settings;

    if (settings.allowProposalsFrom === 'creator') {
      return dao.creator === walletAddress;
    }

    if (settings.allowProposalsFrom === 'members') {
      return dao.members.includes(walletAddress);
    }

    // 'anyone' can propose
    return true;
  }

  private async checkAndFinalizeProposal(
    proposal: ProposalDocument,
    dao: DaoDocument,
  ): Promise<void> {
    const now = new Date();

    // If voting period ended, finalize
    if (now > proposal.votingEndsAt && proposal.status === 'active') {
      await this.finalizeProposal(proposal, dao);
    }
  }

  private async finalizeProposal(
    proposal: ProposalDocument,
    dao: DaoDocument,
  ): Promise<void> {
    // Check quorum
    const quorumMet = proposal.participationRate >= dao.quorumPercentage;

    if (!quorumMet) {
      proposal.status = 'expired';
      this.logger.log(`Proposal ${proposal._id} expired - quorum not met`);
    } else {
      // Determine outcome
      if (proposal.yesVotes > proposal.noVotes) {
        proposal.status = 'passed';
        this.logger.log(`Proposal ${proposal._id} PASSED`);
      } else {
        proposal.status = 'rejected';
        this.logger.log(`Proposal ${proposal._id} REJECTED`);
      }
    }

    await proposal.save();
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  async getDaoStats(daoId: string): Promise<any> {
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

  async getPlatformStats(): Promise<any> {
    const totalDaos = await this.daoModel.countDocuments();
    const activeDaos = await this.daoModel.countDocuments({ status: 'active' });
    const totalProposals = await this.proposalModel.countDocuments();
    const activeProposals = await this.proposalModel.countDocuments({ status: 'active' });

    // Total members (unique wallets across all DAOs)
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
}
