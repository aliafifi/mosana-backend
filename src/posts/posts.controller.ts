import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MongoIdPipe } from '../common/pipes/mongodb-id.pipe';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Create a new post
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.walletAddress, createPostDto);
  }

  // Get global feed (all posts)
  @Get()
  async getAllPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.postsService.findAll(page, limit);
  }

  // Get home feed (following feed)
  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async getHomeFeed(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getHomeFeed(
      req.user.walletAddress,
      req.user.following || [],
      page,
      limit,
    );
  }

  // Get trending posts
  @Get('trending')
  async getTrending(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getTrending(page, limit);
  }

  // Get single post by ID
  @Get(':id')
  async getPost(@Param('id', MongoIdPipe) id: string) {
    return this.postsService.findOne(id);
  }

  // Get user's posts
  @Get('user/:walletAddress')
  async getUserPosts(
    @Param('walletAddress') walletAddress: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.postsService.findByUser(walletAddress, page, limit);
  }

  // Like a post
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async likePost(@Param('id', MongoIdPipe) id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.walletAddress);
  }

  // Unlike a post
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikePost(@Param('id', MongoIdPipe) id: string, @Request() req) {
    return this.postsService.unlikePost(id, req.user.walletAddress);
  }

  // Add comment to post
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id', MongoIdPipe) id: string,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(
      id,
      req.user.walletAddress,
      createCommentDto,
    );
  }

  // Delete post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id', MongoIdPipe) id: string, @Request() req) {
    return this.postsService.delete(id, req.user.walletAddress);
  }
}
