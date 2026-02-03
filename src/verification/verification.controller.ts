import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CheckVerificationDto } from './dto/check-verification.dto';
import {
  VerificationResultDto,
  ProviderListDto,
} from './dto/verification-result.dto';
import { VerificationProvider } from './schemas/verification.schema';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  /**
   * Get verification status for a wallet
   * Public endpoint - anyone can check
   */
  @Get(':walletAddress/status')
  async getVerificationStatus(
    @Param('walletAddress') walletAddress: string,
    @Query() query: CheckVerificationDto,
  ): Promise<VerificationResultDto> {
    return this.verificationService.checkVerificationStatus(
      walletAddress,
      query.provider,
    );
  }

  /**
   * Refresh verification from on-chain
   * Public endpoint - anyone can trigger a refresh
   */
  @Post(':walletAddress/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshVerification(
    @Param('walletAddress') walletAddress: string,
    @Query() query: CheckVerificationDto,
  ): Promise<VerificationResultDto> {
    return this.verificationService.refreshVerificationFromChain(
      walletAddress,
      query.provider,
    );
  }

  /**
   * Get list of supported verification providers
   * Public endpoint
   */
  @Get('providers')
  async getProviders(): Promise<ProviderListDto[]> {
    return this.verificationService.getProviders();
  }

  /**
   * Get verification statistics
   * Public endpoint
   */
  @Get('stats/platform')
  async getPlatformStats() {
    return this.verificationService.getStats();
  }

  /**
   * Manually add verification (admin only)
   */
  @Post(':walletAddress/add')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addVerification(
    @Param('walletAddress') walletAddress: string,
    @Body('provider') provider: VerificationProvider,
    @Body('expiresInDays') expiresInDays?: number,
    @Body('attestationAddress') attestationAddress?: string,
  ) {
    const verification = await this.verificationService.addVerification(
      walletAddress,
      provider,
      expiresInDays,
      attestationAddress,
    );

    return {
      message: 'Verification added successfully',
      verification,
    };
  }

  /**
   * Revoke verification (admin only)
   */
  @Delete(':walletAddress/revoke')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async revokeVerification(
    @Param('walletAddress') walletAddress: string,
    @Body('provider') provider: VerificationProvider,
    @Body('revokedBy') revokedBy: string,
    @Body('reason') reason?: string,
  ) {
    const verification = await this.verificationService.revokeVerification(
      walletAddress,
      provider,
      revokedBy,
      reason,
    );

    return {
      message: 'Verification revoked successfully',
      verification,
    };
  }

  /**
   * Get all verifications (admin only)
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllVerifications(
    @Query('status') status?: string,
    @Query('provider') provider?: VerificationProvider,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    const result = await this.verificationService.getAllVerifications(
      status as any,
      provider,
      Number(page),
      Number(limit),
    );

    return {
      message: 'Verifications retrieved successfully',
      ...result,
      page: Number(page),
      limit: Number(limit),
    };
  }
}
