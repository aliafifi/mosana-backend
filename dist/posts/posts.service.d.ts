import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class PostsService {
    private postModel;
    constructor(postModel: Model<PostDocument>);
    create(walletAddress: string, createPostDto: CreatePostDto): Promise<Post>;
    findAll(page?: number, limit?: number): Promise<Post[]>;
    getHomeFeed(walletAddress: string, following: string[], page?: number, limit?: number): Promise<Post[]>;
    findOne(postId: string): Promise<Post>;
    findByUser(walletAddress: string, page?: number, limit?: number): Promise<Post[]>;
    likePost(postId: string, walletAddress: string): Promise<Post>;
    unlikePost(postId: string, walletAddress: string): Promise<Post>;
    addComment(postId: string, walletAddress: string, createCommentDto: CreateCommentDto): Promise<Post>;
    delete(postId: string, walletAddress: string): Promise<{
        message: string;
    }>;
    getTrending(page?: number, limit?: number): Promise<Post[]>;
    getCharityPosts(page?: number, limit?: number): Promise<Post[]>;
}
