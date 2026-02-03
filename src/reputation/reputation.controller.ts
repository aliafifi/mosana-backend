import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { ApplyPenaltyDto } from './dto/penalty.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  // ============================================
  // PUBLIC ENDPOINTS (No authentication required)
  // ============================================

  // GET /api/reputation/:walletAddress
  // Get a user's reputation score
  @Get(':walletAddress')
  async getReputation(@Param('walletAddress') walletAddress: string) {
    try {
      const reputation = await this.reputationService.getReputation(walletAddress);

      return {
        success: true,
        data: {
          walletAddress: reputation.walletAddress,
          totalScore: reputation.totalScore,
          level: reputation.level,
          rewardMultiplier: reputation.rewardMultiplier,
          breakdown: reputation.breakdown,
          badges: reputation.badges,
          isFlagged: reputation.isFlagged,
          flagReason: reputation.flagReason,
          lastCalculated: reputation.lastCalculated,
        },
        message: 'Reputation retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET /api/reputation/leaderboard?limit=100
  // Get top users by reputation
  @Get('leaderboard/top')
  async getLeaderboard() {
    try {
      const leaderboard = await this.reputationService.getLeaderboard(100);

      return {
        success: true,
        data: leaderboard.map((rep, index) => ({
          rank: index + 1,
          walletAddress: rep.walletAddress,
          totalScore: rep.totalScore,
          level: rep.level,
          badges: rep.badges,
        })),
        message: 'Leaderboard retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET /api/reputation/stats/platform
  // Get global reputation statistics
  @Get('stats/platform')
  async getPlatformStats() {
    try {
      const stats = await this.reputationService.getPlatformStats();

      return {
        success: true,
        data: stats,
        message: 'Platform stats retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // ============================================
  // PROTECTED ENDPOINTS (Authentication required)
  // ============================================

  // GET /api/reputation/my/score
  // Get the authenticated user's reputation
  @UseGuards(JwtAuthGuard)
  @Get('my/score')
  async getMyReputation(@Req() req: any) {
    try {
      const walletAddress = req.user.walletAddress;
      const reputation = await this.reputationService.getReputation(walletAddress);

      return {
        success: true,
        data: {
          walletAddress: reputation.walletAddress,
          totalScore: reputation.totalScore,
          level: reputation.level,
          rewardMultiplier: reputation.rewardMultiplier,
          breakdown: reputation.breakdown,
          metrics: reputation.metrics,
          badges: reputation.badges,
          penalties: reputation.penalties,
          isFlagged: reputation.isFlagged,
          lastCalculated: reputation.lastCalculated,
          calculationCount: reputation.calculationCount,
        },
        message: 'Your reputation retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // POST /api/reputation/calculate/:walletAddress
  // Force recalculation of a user's reputation
  @UseGuards(JwtAuthGuard)
  @Post('calculate/:walletAddress')
  async calculateReputation(@Param('walletAddress') walletAddress: string) {
    try {
      const reputation = await this.reputationService.calculateReputation(walletAddress);

      return {
        success: true,
        data: {
          walletAddress: reputation.walletAddress,
          totalScore: reputation.totalScore,
          level: reputation.level,
          breakdown: reputation.breakdown,
        },
        message: 'Reputation recalculated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // ============================================
  // ADMIN ENDPOINTS (Admin authentication required)
  // ============================================

  // POST /api/reputation/admin/penalty
  // Apply a penalty to a user (admin only)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/penalty')
  async applyPenalty(@Body() penaltyDto: ApplyPenaltyDto, @Req() req: any) {
    try {
      // TODO: Add admin role check here
      // For now, any authenticated user can apply penalties
      const adminWallet = req.user.walletAddress;

      const reputation = await this.reputationService.applyPenalty(
        penaltyDto,
        adminWallet,
      );

      return {
        success: true,
        data: {
          walletAddress: reputation.walletAddress,
          totalScore: reputation.totalScore,
          level: reputation.level,
          penalties: reputation.penalties,
        },
        message: 'Penalty applied successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET /api/reputation/admin/flagged
  // Get all flagged accounts (admin only)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/flagged')
  async getFlaggedAccounts() {
    try {
      // TODO: Add admin role check here
      const flaggedAccounts = await this.reputationService['reputationModel']
        .find({ isFlagged: true })
        .select('walletAddress totalScore level flagReason lastCalculated')
        .limit(100)
        .exec();

      return {
        success: true,
        data: flaggedAccounts,
        message: 'Flagged accounts retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
