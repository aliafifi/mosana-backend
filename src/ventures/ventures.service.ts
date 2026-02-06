import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venture, VentureDocument } from './schemas/venture.schema';
import { RevenueSplit, RevenueSplitDocument } from './schemas/revenue-split.schema';
import { CreateVentureDto } from './dto/create-venture.dto';
import { ReputationService } from '../reputation/reputation.service';

@Injectable()
export class VenturesService {
  private readonly logger = new Logger(VenturesService.name);

  constructor(
    @InjectModel(Venture.name) private ventureModel: Model<VentureDocument>,
    @InjectModel(RevenueSplit.name) private revenueSplitModel: Model<RevenueSplitDocument>,
    private reputationService: ReputationService,
  ) {}

  /**
   * Create a new venture for a post
   */
  async createVenture(createVentureDto: CreateVentureDto, initiatorWallet: string): Promise<VentureDocument> {
    // Validate that shares add up to 100%
    const totalShares = createVentureDto.collaborators.reduce(
      (sum, collab) => sum + collab.sharePercentage,
      0,
    );

    if (totalShares !== 100) {
      throw new BadRequestException(
        `Share percentages must add up to 100%. Current total: ${totalShares}%`,
      );
    }

    // Check if venture already exists for this post
    const existingVenture = await this.ventureModel.findOne({ postId: createVentureDto.postId });
    if (existingVenture) {
      throw new BadRequestException('A venture already exists for this post');
    }

    // Validate no duplicate wallets
    const wallets = createVentureDto.collaborators.map(c => c.walletAddress);
    const uniqueWallets = new Set(wallets);
    if (wallets.length !== uniqueWallets.size) {
      throw new BadRequestException('Duplicate collaborator wallets are not allowed');
    }

    // Check if initiator is in collaborators list
    const initiatorInList = createVentureDto.collaborators.some(
      c => c.walletAddress === initiatorWallet,
    );
    if (!initiatorInList) {
      throw new BadRequestException('Initiator must be included in collaborators list');
    }

    // Create the venture
    const venture = new this.ventureModel({
      postId: createVentureDto.postId,
      initiator: initiatorWallet,
      collaborators: createVentureDto.collaborators.map(c => ({
        walletAddress: c.walletAddress,
        sharePercentage: c.sharePercentage,
        hasAccepted: c.walletAddress === initiatorWallet, // Auto-accept for initiator
      })),
      description: createVentureDto.description,
      status: 'pending',
    });

    await venture.save();

    // Update reputation: initiator joined a venture (auto-accepted)
    try {
      await this.reputationService.updateMetrics(initiatorWallet, {
        venturesJoined: 1,
      });
    } catch (error) {
      // Silently fail - don't block venture creation if reputation update fails
      this.logger.warn(`Reputation update failed for ${initiatorWallet}: ${error.message}`);
    }

    this.logger.log(`Venture created for post ${createVentureDto.postId} by ${initiatorWallet}`);

    return venture;
  }

  /**
   * Accept a venture invitation
   */
  async acceptVenture(ventureId: string, walletAddress: string): Promise<VentureDocument> {
    const venture = await this.ventureModel.findById(ventureId);
    if (!venture) {
      throw new NotFoundException('Venture not found');
    }

    // Find the collaborator
    const collaborator = venture.collaborators.find(c => c.walletAddress === walletAddress);
    if (!collaborator) {
      throw new BadRequestException('You are not a collaborator in this venture');
    }

    if (collaborator.hasAccepted) {
      throw new BadRequestException('You have already accepted this venture');
    }

    // Mark as accepted
    collaborator.hasAccepted = true;

    // Check if all collaborators have accepted
    const allAccepted = venture.collaborators.every(c => c.hasAccepted);
    if (allAccepted) {
      venture.status = 'active';
      this.logger.log(`Venture ${ventureId} is now active - all collaborators accepted`);
    }

    await venture.save();

    // Update reputation: user joined a venture
    try {
      await this.reputationService.updateMetrics(walletAddress, {
        venturesJoined: 1,
      });
    } catch (error) {
      // Silently fail - don't block acceptance if reputation update fails
      this.logger.warn(`Reputation update failed for ${walletAddress}: ${error.message}`);
    }

    return venture;
  }

  /**
   * Reject a venture invitation
   */
  async rejectVenture(ventureId: string, walletAddress: string): Promise<VentureDocument> {
    const venture = await this.ventureModel.findById(ventureId);
    if (!venture) {
      throw new NotFoundException('Venture not found');
    }

    // Find the collaborator
    const collaborator = venture.collaborators.find(c => c.walletAddress === walletAddress);
    if (!collaborator) {
      throw new BadRequestException('You are not a collaborator in this venture');
    }

    // Mark venture as rejected
    venture.status = 'rejected';
    await venture.save();

    this.logger.log(`Venture ${ventureId} rejected by ${walletAddress}`);
    return venture;
  }

  /**
   * Split revenue among collaborators
   * This is called automatically when a tip or NFT sale happens
   */
  async splitRevenue(
    ventureId: string,
    totalAmount: number,
    source: 'tip' | 'nft-sale' | 'royalty' | 'other',
    sender?: string,
  ): Promise<RevenueSplitDocument> {
    const venture = await this.ventureModel.findById(ventureId);
    if (!venture) {
      throw new NotFoundException('Venture not found');
    }

    if (venture.status !== 'active') {
      throw new BadRequestException('Venture must be active to split revenue');
    }

    // Calculate each collaborator's share
    const payments = venture.collaborators.map(collaborator => ({
      walletAddress: collaborator.walletAddress,
      amount: Math.floor((totalAmount * collaborator.sharePercentage) / 100),
      sharePercentage: collaborator.sharePercentage,
    }));

    // Create revenue split record
    const revenueSplit = new this.revenueSplitModel({
      ventureId,
      postId: venture.postId,
      totalAmount,
      source,
      payments,
      sender,
    });

    await revenueSplit.save();

    // Update venture stats
    venture.totalRevenueGenerated += totalAmount;
    venture.totalSplits += 1;
    await venture.save();

    this.logger.log(
      `Revenue split: ${totalAmount} tokens from ${source} distributed among ${payments.length} collaborators`,
    );

    return revenueSplit;
  }

  /**
   * Get venture by post ID
   */
  async getVentureByPostId(postId: string): Promise<VentureDocument | null> {
    return this.ventureModel.findOne({ postId }).populate('postId');
  }

  /**
   * Get all ventures for a user (as initiator or collaborator)
   */
  async getUserVentures(walletAddress: string): Promise<VentureDocument[]> {
    return this.ventureModel.find({
      $or: [
        { initiator: walletAddress },
        { 'collaborators.walletAddress': walletAddress },
      ],
    }).populate('postId').sort({ createdAt: -1 });
  }

  /**
   * Get pending venture invitations for a user
   */
  async getPendingInvitations(walletAddress: string): Promise<VentureDocument[]> {
    return this.ventureModel.find({
      status: 'pending',
      'collaborators': {
        $elemMatch: {
          walletAddress,
          hasAccepted: false,
        },
      },
    }).populate('postId').sort({ createdAt: -1 });
  }

  /**
   * Get revenue split history for a venture
   */
  async getVentureSplitHistory(ventureId: string): Promise<RevenueSplitDocument[]> {
    return this.revenueSplitModel.find({ ventureId }).sort({ createdAt: -1 });
  }

  /**
   * Get user's earnings from ventures
   */
  async getUserVentureEarnings(walletAddress: string): Promise<any> {
    const splits = await this.revenueSplitModel.find({
      'payments.walletAddress': walletAddress,
    });

    let totalEarnings = 0;
    let earningsBySource = {
      tip: 0,
      'nft-sale': 0,
      royalty: 0,
      other: 0,
    };

    splits.forEach(split => {
      const payment = split.payments.find(p => p.walletAddress === walletAddress);
      if (payment) {
        totalEarnings += payment.amount;
        earningsBySource[split.source] += payment.amount;
      }
    });

    return {
      totalEarnings,
      earningsBySource,
      totalSplits: splits.length,
    };
  }

  /**
   * Get user-specific venture statistics
   */
  async getUserVentureStats(walletAddress: string): Promise<any> {
    // Get user's ventures
    const userVentures = await this.ventureModel.find({
      'collaborators.walletAddress': walletAddress,
    });

    // Count by status
    const venturesByStatus = {
      active: userVentures.filter(v => v.status === 'active').length,
      pending: userVentures.filter(v => v.status === 'pending').length,
      rejected: userVentures.filter(v => v.status === 'rejected').length,
    };

    // Get user's earnings from ventures
    const earnings = await this.getUserVentureEarnings(walletAddress);

    // Calculate user's share percentages
    const shareInfo = userVentures.map(venture => {
      const collaborator = venture.collaborators.find(
        c => c.walletAddress === walletAddress,
      );
      return {
        ventureId: venture._id,
        postId: venture.postId,
        status: venture.status,
        myShare: collaborator?.sharePercentage || 0,
        totalRevenue: venture.totalRevenueGenerated,
      };
    });

    return {
      walletAddress,
      summary: {
        totalVentures: userVentures.length,
        ...venturesByStatus,
      },
      earnings,
      ventures: shareInfo,
    };
  }

  /**
   * Get platform-wide venture statistics
   */
  async getVentureStats(): Promise<any> {
    const totalVentures = await this.ventureModel.countDocuments();
    const activeVentures = await this.ventureModel.countDocuments({ status: 'active' });
    const pendingVentures = await this.ventureModel.countDocuments({ status: 'pending' });
    
    const revenueStats = await this.revenueSplitModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalSplits: { $sum: 1 },
        },
      },
    ]);

    return {
      totalVentures,
      activeVentures,
      pendingVentures,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      totalSplits: revenueStats[0]?.totalSplits || 0,
    };
  }
}
