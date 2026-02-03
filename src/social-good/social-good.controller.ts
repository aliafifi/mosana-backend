import { Controller, Post, Get, Param, Body, UseGuards, Request, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SocialGoodService } from './social-good.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCauseDto } from './dto/create-cause.dto';

@Controller('social-good')
export class SocialGoodController {
  constructor(private readonly socialGoodService: SocialGoodService) {}

  /**
   * POST /api/social-good/causes
   * Create a new charity cause (admin only - for now)
   */
  @Post('causes')
  @HttpCode(HttpStatus.CREATED)
  async createCause(@Body() createCauseDto: CreateCauseDto) {
    const cause = await this.socialGoodService.createCause(createCauseDto);

    return {
      success: true,
      message: 'Charity cause created successfully',
      data: cause,
    };
  }

  /**
   * GET /api/social-good/causes
   * Get all active charity causes (optionally filter by category)
   */
  @Get('causes')
  async getAllCauses(@Query('category') category?: string) {
    const causes = await this.socialGoodService.getAllCauses(category);

    return {
      success: true,
      count: causes.length,
      data: causes,
    };
  }

  /**
   * GET /api/social-good/causes/:causeId
   * Get single charity cause details
   */
  @Get('causes/:causeId')
  async getCauseById(@Param('causeId') causeId: string) {
    const cause = await this.socialGoodService.getCauseById(causeId);

    return {
      success: true,
      data: cause,
    };
  }

  /**
   * POST /api/social-good/donate
   * Direct donation to a charity (for "Donate Directly" button)
   */
  @Post('donate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async directDonate(
    @Body('causeId') causeId: string,
    @Body('amount') amount: number,
    @Request() req,
  ) {
    const donation = await this.socialGoodService.directDonate(
      req.user.walletAddress,
      causeId,
      amount,
    );

    return {
      success: true,
      message: 'Donation successful! Thank you for your contribution.',
      data: donation,
    };
  }

  /**
   * GET /api/social-good/donations/my-donations
   * Get current user's donation history
   */
  @Get('donations/my-donations')
  @UseGuards(JwtAuthGuard)
  async getMyDonations(@Request() req) {
    const donations = await this.socialGoodService.getUserDonations(
      req.user.walletAddress,
    );

    return {
      success: true,
      count: donations.length,
      data: donations,
    };
  }

  /**
   * GET /api/social-good/causes/:causeId/donations
   * Get donations received by a specific charity
   */
  @Get('causes/:causeId/donations')
  async getCauseDonations(@Param('causeId') causeId: string) {
    const donations = await this.socialGoodService.getCauseDonations(causeId);

    return {
      success: true,
      count: donations.length,
      data: donations,
    };
  }

  /**
   * GET /api/social-good/stats
   * Get platform donation statistics
   */
  @Get('stats')
  async getPlatformStats() {
    const stats = await this.socialGoodService.getPlatformStats();

    return {
      success: true,
      data: stats,
    };
  }
}

