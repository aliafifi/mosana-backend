import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cause, CauseDocument } from './schemas/cause.schema';
import { Donation, DonationDocument } from './schemas/donation.schema';
import { CreateCauseDto } from './dto/create-cause.dto';

@Injectable()
export class SocialGoodService {
  private readonly logger = new Logger(SocialGoodService.name);

  constructor(
    @InjectModel(Cause.name) private causeModel: Model<CauseDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
  ) {}

  /**
   * Create a new charity cause (admin only)
   */
  async createCause(createCauseDto: CreateCauseDto): Promise<CauseDocument> {
    const existingCause = await this.causeModel.findOne({ 
      walletAddress: createCauseDto.walletAddress 
    });

    if (existingCause) {
      throw new BadRequestException('A cause with this wallet address already exists');
    }

    const cause = new this.causeModel({
      ...createCauseDto,
      isVerified: true,
      isActive: true,
    });

    await cause.save();
    this.logger.log(`New cause created: ${cause.name}`);
    return cause;
  }

  /**
   * Get all active causes
   */
  async getAllCauses(category?: string): Promise<CauseDocument[]> {
    const filter: any = { isActive: true };
    
    if (category) {
      filter.category = category;
    }

    return this.causeModel.find(filter).sort({ totalDonationsReceived: -1 });
  }

  /**
   * Get a single cause by ID
   */
  async getCauseById(causeId: string): Promise<CauseDocument> {
    const cause = await this.causeModel.findById(causeId);
    
    if (!cause) {
      throw new NotFoundException('Cause not found');
    }

    return cause;
  }

  /**
   * CORE FUNCTION: Process charity donation from post earnings
   * Called when a post with dedicatedCause receives earnings
   */
  async processPostDonation(
    postId: string,
    causeId: string,
    donorWallet: string,
    totalAmount: number,
    charityPercentage: number,
    source: string,
    sourceTransactionId?: string,
  ): Promise<{ creatorAmount: number; donationAmount: number; donation: DonationDocument }> {
    
    // Validate charity exists
    const cause = await this.getCauseById(causeId);
    
    if (!cause.isActive) {
      throw new BadRequestException('This cause is not currently accepting donations');
    }

    // Calculate donation amount
    const donationAmount = Math.floor((totalAmount * charityPercentage) / 100);
    const creatorAmount = totalAmount - donationAmount;

    // Create donation record
    const donation = new this.donationModel({
      donorWallet,
      causeId,
      amount: donationAmount,
      pledgePercentage: charityPercentage,
      source,
      originalAmount: totalAmount,
      sourceTransactionId,
    });

    await donation.save();

    // Update cause totals
    cause.totalDonationsReceived += donationAmount;
    
    const uniqueDonors = await this.donationModel.distinct('donorWallet', { 
      causeId: cause._id 
    });
    cause.totalDonors = uniqueDonors.length;
    
    await cause.save();

    this.logger.log(
      `Donation processed: ${donorWallet} donated ${donationAmount} (${charityPercentage}%) to ${cause.name} from ${source}`,
    );

    return {
      creatorAmount,
      donationAmount,
      donation,
    };
  }

  /**
   * Direct donation to a cause (for the "Donate Directly" button)
   */
  async directDonate(
    donorWallet: string,
    causeId: string,
    amount: number,
  ): Promise<DonationDocument> {
    
    // Validate charity exists
    const cause = await this.getCauseById(causeId);
    
    if (!cause.isActive) {
      throw new BadRequestException('This cause is not currently accepting donations');
    }

    if (amount <= 0) {
      throw new BadRequestException('Donation amount must be greater than 0');
    }

    // Create donation record
    const donation = new this.donationModel({
      donorWallet,
      causeId,
      amount,
      pledgePercentage: 100, // Direct donation is 100%
      source: 'manual',
      originalAmount: amount,
    });

    await donation.save();

    // Update cause totals
    cause.totalDonationsReceived += amount;
    
    const uniqueDonors = await this.donationModel.distinct('donorWallet', { 
      causeId: cause._id 
    });
    cause.totalDonors = uniqueDonors.length;
    
    await cause.save();

    this.logger.log(
      `Direct donation: ${donorWallet} donated ${amount} tokens to ${cause.name}`,
    );

    return donation;
  }

  /**
   * Get user's donation history
   */
  async getUserDonations(walletAddress: string): Promise<DonationDocument[]> {
    return this.donationModel
      .find({ donorWallet: walletAddress })
      .populate('causeId')
      .sort({ createdAt: -1 });
  }

  /**
   * Get donations received by a cause
   */
  async getCauseDonations(causeId: string): Promise<DonationDocument[]> {
    return this.donationModel
      .find({ causeId })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  /**
   * Get platform donation statistics
   */
  async getPlatformStats(): Promise<any> {
    const totalCauses = await this.causeModel.countDocuments({ isActive: true });
    
    const donationStats = await this.donationModel.aggregate([
      {
        $group: {
          _id: null,
          totalDonations: { $sum: '$amount' },
          donationCount: { $sum: 1 },
        },
      },
    ]);

    const uniqueDonors = await this.donationModel.distinct('donorWallet');

    return {
      totalCauses,
      totalDonations: donationStats[0]?.totalDonations || 0,
      donationCount: donationStats[0]?.donationCount || 0,
      uniqueDonors: uniqueDonors.length,
    };
  }
}
