import { Controller, Post, Get, Param, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { NftMintingService } from './nft-minting.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post as PostModel } from '../posts/post.schema';

@Controller('nft')
export class NftMintingController {
  constructor(
    private readonly nftMintingService: NftMintingService,
    @InjectModel(PostModel.name) private postModel: Model<PostModel>,
  ) {}

  /**
   * POST /api/nft/mint/:postId
   * Mint a post as NFT
   */
  @Post('mint/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async mintPost(
    @Param('postId') postId: string,
    @Body('royaltyPercentage') royaltyPercentage: number = 5,
    @Request() req,
  ) {
    // Fetch the post with author populated
    const post: any = await this.postModel
      .findById(postId)
      .populate('author')
      .exec();

    if (!post) {
      return {
        success: false,
        message: 'Post not found',
      };
    }

    // Verify the user owns this post
    if (post.author.walletAddress !== req.user.walletAddress) {
      return {
        success: false,
        message: 'You can only mint your own posts',
      };
    }

    // Mint the NFT
    const nft = await this.nftMintingService.mintPost(postId, post, royaltyPercentage);

    return {
      success: true,
      message: 'Post minted as NFT successfully',
      data: {
        mintAddress: nft.mintAddress,
        metadataUri: nft.metadataUri,
        royaltyPercentage: nft.royaltyPercentage,
        nft,
      },
    };
  }

  /**
   * GET /api/nft/:mintAddress
   * Get NFT details by mint address
   */
  @Get(':mintAddress')
  async getNft(@Param('mintAddress') mintAddress: string) {
    const nft = await this.nftMintingService.getNftByMintAddress(mintAddress);
    
    return {
      success: true,
      data: nft,
    };
  }

  /**
   * GET /api/nft/user/:walletAddress
   * Get all NFTs created by a user
   */
  @Get('user/:walletAddress')
  async getUserNfts(@Param('walletAddress') walletAddress: string) {
    const nfts = await this.nftMintingService.getUserNfts(walletAddress);
    
    return {
      success: true,
      count: nfts.length,
      data: nfts,
    };
  }

  /**
   * GET /api/nft/check/:postId
   * Check if a post has been minted
   */
  @Get('check/:postId')
  async checkPostMinted(@Param('postId') postId: string) {
    const result = await this.nftMintingService.checkIfPostMinted(postId);
    
    return {
      success: true,
      ...result,
    };
  }

  /**
   * GET /api/nft/stats/platform
   * Get platform minting statistics
   */
  @Get('stats/platform')
  async getMintingStats() {
    const stats = await this.nftMintingService.getMintingStats();
    
    return {
      success: true,
      data: stats,
    };
  }
}
