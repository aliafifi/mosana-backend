import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Request,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TippingService } from './tipping.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTipDto } from './dto/create-tip.dto';

@Controller('tipping')
export class TippingController {
  constructor(private readonly tippingService: TippingService) {}

  // Create a tip
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTip(@Request() req, @Body() createTipDto: CreateTipDto) {
    return this.tippingService.createTip(req.user.walletAddress, createTipDto);
  }

  // Get tips sent by authenticated user
  @UseGuards(JwtAuthGuard)
  @Get('sent')
  async getSentTips(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.tippingService.getSentTips(req.user.walletAddress, page, limit);
  }

  // Get tips received by authenticated user
  @UseGuards(JwtAuthGuard)
  @Get('received')
  async getReceivedTips(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.tippingService.getReceivedTips(req.user.walletAddress, page, limit);
  }

  // Get tips on a specific post (public)
  @Get('post/:postId')
  async getPostTips(@Param('postId') postId: string) {
    return this.tippingService.getPostTips(postId);
  }

  // Get authenticated user's tipping statistics
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getUserStats(@Request() req) {
    return this.tippingService.getUserStats(req.user.walletAddress);
  }

  // Get platform tipping statistics (public - transparency!)
  @Get('stats/platform')
  async getPlatformStats() {
    return this.tippingService.getPlatformStats();
  }

  // Calculate fee preview (public - show before tipping)
  @Get('preview/:amount')
  async getFeePreview(@Param('amount', ParseIntPipe) amount: number) {
    return this.tippingService.calculateFeePreview(amount);
  }

  // Get fee tiers info (public - transparency)
  @Get('fee-tiers')
  async getFeeTiers() {
    return {
      tiers: [
        { name: 'Small', max: 100, fee: '1%', description: 'Tips up to 100 tokens' },
        { name: 'Medium', max: 1000, fee: '0.75%', description: 'Tips 101-1,000 tokens' },
        { name: 'Large', max: 10000, fee: '0.5%', description: 'Tips 1,001-10,000 tokens' },
        { name: 'Whale', max: 'Unlimited', fee: '0.25%', description: 'Tips over 10,000 tokens' },
      ],
      feeSplit: {
        burned: '50%',
        rewards: '50%',
        description: 'Half of fees are burned forever 🔥, half fund community rewards',
      },
      comparison: {
        mosana: '0.25% - 1%',
        youtube: '30%',
        patreon: '5-12%',
        onlyfans: '20%',
        message: 'Mosana has the lowest fees in social media!',
      },
    };
  }
}
