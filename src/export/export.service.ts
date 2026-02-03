import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Export, ExportDocument, ExportStatus } from './schemas/export.schema';
import { ExportRequestDto } from './dto/export-request.dto';
import { ExportResultDto, UserDataExportDto } from './dto/export-result.dto';

// Import all the models we need
import { User } from '../users/user.schema';
import { Post } from '../posts/post.schema';
import { Tip } from '../tipping/tip.schema';
import { Donation } from '../social-good/schemas/donation.schema';
import { Nft } from '../nft-minting/schemas/nft.schema';
import { Dao } from '../dao/schemas/dao.schema';
import { Proposal } from '../dao/schemas/proposal.schema';
import { Venture } from '../ventures/schemas/venture.schema';
import { Reward } from '../rewards/reward.schema';
import { Reputation } from '../reputation/schemas/reputation.schema';
import { Verification } from '../verification/schemas/verification.schema';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    @InjectModel(Export.name)
    private exportModel: Model<ExportDocument>,
    @InjectModel(User.name)
    private userModel: Model<any>,
    @InjectModel(Post.name)
    private postModel: Model<any>,
    @InjectModel(Tip.name)
    private tipModel: Model<any>,
    @InjectModel(Donation.name)
    private donationModel: Model<any>,
    @InjectModel(Nft.name)
    private nftModel: Model<any>,
    @InjectModel(Dao.name)
    private daoModel: Model<any>,
    @InjectModel(Proposal.name)
    private proposalModel: Model<any>,
    @InjectModel(Venture.name)
    private ventureModel: Model<any>,
    @InjectModel(Reward.name)
    private rewardModel: Model<any>,
    @InjectModel(Reputation.name)
    private reputationModel: Model<any>,
    @InjectModel(Verification.name)
    private verificationModel: Model<any>,
  ) {}

  /**
   * Request a data export
   */
  async requestExport(
    walletAddress: string,
    dto: ExportRequestDto,
  ): Promise<ExportResultDto> {
    this.logger.log(`Export requested for ${walletAddress}`);

    // Create export record
    const exportRecord = await this.exportModel.create({
      walletAddress,
      format: dto.format || 'json',
      status: ExportStatus.PENDING,
      requestedAt: new Date(),
    });

    // Start export process asynchronously
    this.processExport(exportRecord._id.toString(), walletAddress, dto).catch(
      (error) => {
        this.logger.error(
          `Export failed for ${walletAddress}: ${error.message}`,
        );
      },
    );

    return this.mapToResultDto(exportRecord);
  }

  /**
   * Process the export (aggregates all data)
   */
  private async processExport(
    exportId: string,
    walletAddress: string,
    dto: ExportRequestDto,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Update status to processing
      await this.exportModel.findByIdAndUpdate(exportId, {
        status: ExportStatus.PROCESSING,
      });

      // Aggregate all user data
      const userData = await this.aggregateUserData(walletAddress);

      // Convert to JSON
      const jsonData = JSON.stringify(userData, null, 2);
      const fileSize = Buffer.byteLength(jsonData, 'utf8');

      // TODO: In production, save to file system or upload to Arweave
      // For now, we'll store metadata only

      const metadata = {
        totalPosts: userData.posts.length,
        totalComments: userData.comments.length,
        totalTips: userData.tipping.sent.length + userData.tipping.received.length,
        totalDonations: userData.donations.history.length,
        totalNFTs: userData.nfts.length,
        exportDuration: Date.now() - startTime,
      };

      // Update export record
      await this.exportModel.findByIdAndUpdate(exportId, {
        status: ExportStatus.COMPLETED,
        fileSize,
        metadata,
        completedAt: new Date(),
        // TODO: Add downloadUrl and arweaveUrl when storage is implemented
      });

      this.logger.log(
        `Export completed for ${walletAddress} in ${metadata.exportDuration}ms`,
      );
    } catch (error) {
      this.logger.error(`Export processing failed: ${error.message}`);
      await this.exportModel.findByIdAndUpdate(exportId, {
        status: ExportStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }

  /**
   * Aggregate all user data from all modules
   */
  private async aggregateUserData(
    walletAddress: string,
  ): Promise<UserDataExportDto> {
    this.logger.log(`Aggregating data for ${walletAddress}`);

    // Fetch data from all collections in parallel
    const [
      user,
      posts,
      tipsSent,
      tipsReceived,
      donations,
      nfts,
      daos,
      proposals,
      ventures,
      rewards,
      reputation,
      verifications,
    ] = await Promise.all([
      this.userModel.findOne({ walletAddress }),
      this.postModel.find({ walletAddress }).sort({ createdAt: -1 }),
      this.tipModel.find({ fromWallet: walletAddress }).sort({ createdAt: -1 }),
      this.tipModel.find({ toWallet: walletAddress }).sort({ createdAt: -1 }),
      this.donationModel.find({ donorWallet: walletAddress }).sort({ createdAt: -1 }),
      this.nftModel.find({ creator: walletAddress }).sort({ createdAt: -1 }),
      this.daoModel.find({ 'members.walletAddress': walletAddress }),
      this.proposalModel.find({ proposer: walletAddress }).sort({ createdAt: -1 }),
      this.ventureModel.find({ 'collaborators.walletAddress': walletAddress }),
      this.rewardModel.find({ walletAddress }).sort({ createdAt: -1 }),
      this.reputationModel.findOne({ walletAddress }),
      this.verificationModel.find({ walletAddress }).sort({ verifiedAt: -1 }),
    ]);

    // Extract comments from posts
        const comments: Array<{
      postId: string;
      content: string;
      gifUrl?: string;
      createdAt: Date;
    }> = [];
    const allPosts = await this.postModel.find({});
    for (const post of allPosts) {
      if (post.comments && post.comments.length > 0) {
        for (const comment of post.comments) {
          if (comment.walletAddress === walletAddress) {
            comments.push({
              postId: post._id.toString(),
              content: comment.content,
              gifUrl: comment.gifUrl,
              createdAt: comment.createdAt,
            });
          }
        }
      }
    }

    // Build the export data structure
    return {
      exportedAt: new Date(),
      walletAddress,

      profile: {
        username: user?.username,
        bio: user?.bio,
        profilePictureUrl: user?.profilePictureUrl,
        nftPfp: user?.nftPfp,
        solDomain: user?.solDomain,
        createdAt: user?.createdAt,
      },

      socialGraph: {
        followers: user?.followers || [],
        following: user?.following || [],
        followerCount: user?.followerCount || 0,
        followingCount: user?.followingCount || 0,
      },

      posts: posts.map((post) => ({
        id: post._id.toString(),
        content: post.content,
        mediaUrls: post.mediaUrls,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        dedicatedCause: post.dedicatedCause?.toString(),
        charityPercentage: post.charityPercentage,
      })),

      comments,

      reputation: reputation
        ? {
            totalScore: reputation.totalScore,
            level: reputation.level,
            rewardMultiplier: reputation.rewardMultiplier,
            breakdown: reputation.breakdown,
            badges: reputation.badges,
            lastCalculated: reputation.lastCalculated,
          }
        : {
            totalScore: 0,
            level: 'New',
            rewardMultiplier: 1.0,
            breakdown: {},
            badges: [],
            lastCalculated: new Date(),
          },

      tipping: {
        sent: tipsSent.map((tip) => ({
          amount: tip.amount,
          currency: tip.currency,
          toWallet: tip.toWallet,
          postId: tip.postId?.toString(),
          createdAt: tip.createdAt,
        })),
        received: tipsReceived.map((tip) => ({
          amount: tip.amount,
          currency: tip.currency,
          fromWallet: tip.fromWallet,
          postId: tip.postId?.toString(),
          createdAt: tip.createdAt,
        })),
        totalSent: tipsSent.reduce((sum, tip) => sum + tip.amount, 0),
        totalReceived: tipsReceived.reduce((sum, tip) => sum + tip.amount, 0),
      },

      donations: {
        history: donations.map((donation) => ({
          causeId: donation.causeId?.toString(),
          causeName: donation.causeName,
          amount: donation.amount,
          createdAt: donation.createdAt,
        })),
        totalDonated: donations.reduce((sum, d) => sum + d.amount, 0),
      },

      nfts: nfts.map((nft) => ({
        mintAddress: nft.mintAddress,
        postId: nft.postId?.toString(),
        metadataUri: nft.metadataUri,
        royaltyPercentage: nft.royaltyPercentage,
        createdAt: nft.createdAt,
      })),

      daos: {
        joined: daos.map((dao) => ({
          daoId: dao._id.toString(),
          name: dao.name,
          joinedAt: dao.createdAt, // TODO: Track actual join date
        })),
        proposals: proposals.map((proposal) => ({
          proposalId: proposal._id.toString(),
          daoId: proposal.daoId?.toString(),
          title: proposal.title,
          createdAt: proposal.createdAt,
        })),
        votes: [], // TODO: Extract votes from proposals
      },

      ventures: ventures.map((venture) => {
        const userCollaborator = venture.collaborators.find(
          (c) => c.walletAddress === walletAddress,
        );
        return {
          ventureId: venture._id.toString(),
          postId: venture.postId?.toString(),
          sharePercentage: userCollaborator?.sharePercentage || 0,
          totalEarnings: 0, // TODO: Calculate from revenue splits
          status: venture.status,
          createdAt: venture.createdAt,
        };
      }),

      rewards: {
        totalEarned: rewards.reduce((sum, r) => sum + r.amount, 0),
        history: rewards.map((reward) => ({
          amount: reward.amount,
          date: reward.createdAt,
          status: reward.status,
        })),
      },

      verification: {
        isVerified: verifications.some((v) => v.status === 'active'),
        verifications: verifications.map((v) => ({
          provider: v.provider,
          status: v.status,
          verifiedAt: v.verifiedAt,
          expiresAt: v.expiresAt,
        })),
      },
    };
  }

  /**
   * Get export status
   */
  async getExportStatus(
    walletAddress: string,
    exportId: string,
  ): Promise<ExportResultDto> {
    const exportRecord = await this.exportModel.findOne({
      _id: exportId,
      walletAddress,
    });

    if (!exportRecord) {
      throw new NotFoundException('Export not found');
    }

    return this.mapToResultDto(exportRecord);
  }

  /**
   * Get export history for a user
   */
  async getExportHistory(
    walletAddress: string,
    limit = 10,
  ): Promise<ExportResultDto[]> {
    const exports = await this.exportModel
      .find({ walletAddress })
      .sort({ requestedAt: -1 })
      .limit(limit);

    return exports.map((exp) => this.mapToResultDto(exp));
  }

  /**
   * Map export document to DTO
   */
  private mapToResultDto(exportDoc: ExportDocument): ExportResultDto {
    return {
      exportId: exportDoc._id.toString(),
      walletAddress: exportDoc.walletAddress,
      status: exportDoc.status,
      downloadUrl: exportDoc.downloadUrl,
      arweaveUrl: exportDoc.arweaveUrl,
      arweaveTransactionId: exportDoc.arweaveTransactionId,
      fileSize: exportDoc.fileSize,
      expiresAt: exportDoc.expiresAt,
      requestedAt: exportDoc.requestedAt,
      completedAt: exportDoc.completedAt,
      metadata: exportDoc.metadata,
    };
  }
}
