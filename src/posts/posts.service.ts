import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReputationService } from '../reputation/reputation.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private reputationService: ReputationService,
  ) {}

  // Create a new post
  async create(walletAddress: string, createPostDto: CreatePostDto): Promise<Post> {
    const post = await this.postModel.create({
      walletAddress,
      content: createPostDto.content,
      mediaUrls: createPostDto.mediaUrls,
      tags: createPostDto.tags,
      // Charity fields (Feature 8: Social Good)
      ...(createPostDto.dedicatedCause && { dedicatedCause: createPostDto.dedicatedCause }),
      ...(createPostDto.charityPercentage && { charityPercentage: createPostDto.charityPercentage }),
    });
    
    // Update reputation: user created a post
    try {
      await this.reputationService.updateMetrics(createPostDto.author, {
        totalPosts: 1,
      });
    } catch (error) {
     // Silently fail - don't block post creation if reputation update fails
     console.log('Reputation update failed:', error.message);
    }

    return post;
  }

  // Get all posts (global feed) with pagination
  async findAll(page: number = 1, limit: number = 20): Promise<Post[]> {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find({ isActive: true })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate('dedicatedCause') // Populate charity info
      .exec();

    return posts;
  }

  // Get posts from followed users (home feed)
  async getHomeFeed(
    walletAddress: string,
    following: string[],
    page: number = 1,
    limit: number = 20,
  ): Promise<Post[]> {
    const skip = (page - 1) * limit;

    // Include own posts + followed users' posts
    const wallets = [walletAddress, ...following];

    const posts = await this.postModel
      .find({ 
        walletAddress: { $in: wallets },
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('dedicatedCause') // Populate charity info
      .exec();

    return posts;
  }

  // Get single post by ID
  async findOne(postId: string): Promise<Post> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel.findOne({ 
      _id: postId,
      isActive: true,
    })
    .populate('dedicatedCause') // Populate charity info
    .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment view count
    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { viewsCount: 1 },
    });

    return post;
  }

  // Get user's posts (profile feed)
  async findByUser(walletAddress: string, page: number = 1, limit: number = 20): Promise<Post[]> {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find({ walletAddress, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('dedicatedCause') // Populate charity info
      .exec();

    return posts;
  }

  // Like a post
  async likePost(postId: string, walletAddress: string): Promise<Post> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if already liked
    if (post.likedBy.includes(walletAddress)) {
      throw new BadRequestException('Already liked this post');
    }

    // Add like
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: { likedBy: walletAddress },
        $inc: { likesCount: 1 },
      },
      { new: true },
    )
    .populate('dedicatedCause'); // Populate charity info

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  // Unlike a post
  async unlikePost(postId: string, walletAddress: string): Promise<Post> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if not liked
    if (!post.likedBy.includes(walletAddress)) {
      throw new BadRequestException('You have not liked this post');
    }

    // Remove like
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { likedBy: walletAddress },
        $inc: { likesCount: -1 },
      },
      { new: true },
    )
    .populate('dedicatedCause'); // Populate charity info

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  // Add comment to post
  async addComment(
    postId: string,
    walletAddress: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Post> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Create comment object
    const comment = {
      _id: new Types.ObjectId(),
      walletAddress,
      content: createCommentDto.content,
      gifUrl: createCommentDto.gifUrl || null,
      createdAt: new Date(),
    };

    // Add comment
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment },
        $inc: { commentsCount: 1 },
      },
      { new: true },
    )
    .populate('dedicatedCause'); // Populate charity info

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  // Delete post (soft delete)
  async delete(postId: string, walletAddress: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // SECURITY: Only post author can delete
    if (post.walletAddress !== walletAddress) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    // Soft delete (set isActive to false)
    await this.postModel.findByIdAndUpdate(postId, { isActive: false });

    return { message: 'Post deleted successfully' };
  }

  // Get trending posts (most liked)
  async getTrending(page: number = 1, limit: number = 20): Promise<Post[]> {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find({ isActive: true })
      .sort({ likesCount: -1, createdAt: -1 }) // Most liked, then newest
      .skip(skip)
      .limit(limit)
      .populate('dedicatedCause') // Populate charity info
      .exec();

    return posts;
  }

  // Get charity posts only (Feature 8: Social Good)
  async getCharityPosts(page: number = 1, limit: number = 20): Promise<Post[]> {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find({ 
        isActive: true,
        dedicatedCause: { $ne: null },
        charityPercentage: { $gt: 0 }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('dedicatedCause')
      .exec();

    return posts;
  }
}
