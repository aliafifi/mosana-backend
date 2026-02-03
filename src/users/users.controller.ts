import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetNftPfpDto } from './dto/set-nft-pfp.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get authenticated user's own profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.usersService.findByWallet(req.user.walletAddress);
  }

  // Get any user's public profile by wallet address
  @Get(':walletAddress')
  async getUserProfile(@Param('walletAddress') walletAddress: string) {
    return this.usersService.findByWallet(walletAddress);
  }

  // Update authenticated user's profile
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      req.user.walletAddress,
      updateProfileDto,
    );
  }

  // Set NFT as profile picture
  @UseGuards(JwtAuthGuard)
  @Post('nft-pfp')
  async setNftProfilePicture(
    @Request() req,
    @Body() setNftPfpDto: SetNftPfpDto,
  ) {
    return this.usersService.setNftProfilePicture(
      req.user.walletAddress,
      setNftPfpDto,
    );
  }

  // Follow a user
  @UseGuards(JwtAuthGuard)
  @Post('follow/:walletAddress')
  @HttpCode(HttpStatus.OK)
  async followUser(
    @Request() req,
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.usersService.followUser(req.user.walletAddress, walletAddress);
  }

  // Unfollow a user
  @UseGuards(JwtAuthGuard)
  @Delete('follow/:walletAddress')
  async unfollowUser(
    @Request() req,
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.usersService.unfollowUser(req.user.walletAddress, walletAddress);
  }
}
