import { Controller, Post, Get, Put, Param, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { VenturesService } from './ventures.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MongoIdPipe } from '../common/pipes/mongodb-id.pipe';
import { CreateVentureDto } from './dto/create-venture.dto';

@Controller('ventures')
export class VenturesController {
  constructor(private readonly venturesService: VenturesService) {}

  /**
   * POST /api/ventures
   * Create a new venture
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createVenture(
    @Body() createVentureDto: CreateVentureDto,
    @Request() req,
  ) {
    const venture = await this.venturesService.createVenture(
      createVentureDto,
      req.user.walletAddress,
    );

    return {
      success: true,
      message: 'Venture created successfully',
      data: venture,
    };
  }

  /**
   * PUT /api/ventures/:ventureId/accept
   * Accept a venture invitation
   */
  @Put(':ventureId/accept')
  @UseGuards(JwtAuthGuard)
  async acceptVenture(
    @Param('ventureId', MongoIdPipe) ventureId: string,
    @Request() req,
  ) {
    const venture = await this.venturesService.acceptVenture(
      ventureId,
      req.user.walletAddress,
    );

    return {
      success: true,
      message: 'Venture accepted successfully',
      data: venture,
    };
  }

  /**
   * PUT /api/ventures/:ventureId/reject
   * Reject a venture invitation
   */
  @Put(':ventureId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectVenture(
    @Param('ventureId', MongoIdPipe) ventureId: string,
    @Request() req,
  ) {
    const venture = await this.venturesService.rejectVenture(
      ventureId,
      req.user.walletAddress,
    );

    return {
      success: true,
      message: 'Venture rejected',
      data: venture,
    };
  }

  /**
   * GET /api/ventures/post/:postId
   * Get venture for a specific post
   */
  @Get('post/:postId')
  async getVentureByPost(@Param('postId') postId: string) {
    const venture = await this.venturesService.getVentureByPostId(postId);

    if (!venture) {
      return {
        success: true,
        message: 'No venture found for this post',
        data: null,
      };
    }

    return {
      success: true,
      data: venture,
    };
  }

  /**
   * GET /api/ventures/my-ventures
   * Get all ventures for current user
   */
  @Get('my-ventures')
  @UseGuards(JwtAuthGuard)
  async getMyVentures(@Request() req) {
    const ventures = await this.venturesService.getUserVentures(
      req.user.walletAddress,
    );

    return {
      success: true,
      count: ventures.length,
      data: ventures,
    };
  }

  /**
   * GET /api/ventures/invitations
   * Get pending venture invitations
   */
  @Get('invitations')
  @UseGuards(JwtAuthGuard)
  async getPendingInvitations(@Request() req) {
    const invitations = await this.venturesService.getPendingInvitations(
      req.user.walletAddress,
    );

    return {
      success: true,
      count: invitations.length,
      data: invitations,
    };
  }

  /**
   * GET /api/ventures/:ventureId/splits
   * Get revenue split history for a venture
   */
  @Get(':ventureId/splits')
  async getVentureSplits(@Param('ventureId', MongoIdPipe) ventureId: string) {
    const splits = await this.venturesService.getVentureSplitHistory(ventureId);

    return {
      success: true,
      count: splits.length,
      data: splits,
    };
  }

  /**
   * GET /api/ventures/earnings
   * Get user's earnings from all ventures
   */
  @Get('earnings')
  @UseGuards(JwtAuthGuard)
  async getMyEarnings(@Request() req) {
    const earnings = await this.venturesService.getUserVentureEarnings(
      req.user.walletAddress,
    );

    return {
      success: true,
      data: earnings,
    };
  }

  /**
   * GET /api/ventures/stats
   * Get user's venture statistics
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getUserVentureStats(@Request() req) {
    const stats = await this.venturesService.getUserVentureStats(
      req.user.walletAddress,
    );

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * GET /api/ventures/stats/platform
   * Get platform-wide venture statistics (public - transparency!)
   */
  @Get('stats/platform')
  async getVentureStats() {
    const stats = await this.venturesService.getVentureStats();

    return {
      success: true,
      data: stats,
    };
  }
}
