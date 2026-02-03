import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // Get today's engagement progress
  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getTodayProgress(@Request() req) {
    return this.rewardsService.getTodayEngagement(req.user.walletAddress);
  }

  // Get rewards history
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getRewardsHistory(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.rewardsService.getRewardsHistory(
      req.user.walletAddress,
      page,
      limit,
    );
  }

  // Get tokenomics info (public)
  @Get('tokenomics')
  getTokenomics() {
    const currentYear = new Date().getFullYear();
    
    return {
      totalSupply: 10_000_000_000,
      communityPool: 4_500_000_000,
      currentYear,
      yearlyAllocation: this.getYearlyAllocation(currentYear),
      dailyPool: this.getDailyPool(currentYear),
      pointValues: {
        postCreated: 10,
        likeReceived: 5,
        commentReceived: 8,
        viewReceived: 1,
        likeGiven: 1,
        commentGiven: 2,
      },
      minimumPoints: 10,
      maxPointsPerDay: 10_000,
    };
  }

  // Helper methods
  private getYearlyAllocation(year: number): number {
    const schedule: { [key: number]: number } = {
      2026: 600_000_000,
      2027: 550_000_000,
      2028: 500_000_000,
      2029: 450_000_000,
      2030: 400_000_000,
      2031: 375_000_000,
      2032: 350_000_000,
      2033: 325_000_000,
      2034: 300_000_000,
      2035: 250_000_000,
    };
    return schedule[year] || 250_000_000;
  }

  private getDailyPool(year: number): number {
    return Math.floor(this.getYearlyAllocation(year) / 365);
  }
}
