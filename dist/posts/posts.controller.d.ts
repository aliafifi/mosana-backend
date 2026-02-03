import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(req: any, createPostDto: CreatePostDto): Promise<import("./post.schema").Post>;
    getAllPosts(page: number, limit: number): Promise<import("./post.schema").Post[]>;
    getHomeFeed(req: any, page: number, limit: number): Promise<import("./post.schema").Post[]>;
    getTrending(page: number, limit: number): Promise<import("./post.schema").Post[]>;
    getPost(id: string): Promise<import("./post.schema").Post>;
    getUserPosts(walletAddress: string, page: number, limit: number): Promise<import("./post.schema").Post[]>;
    likePost(id: string, req: any): Promise<import("./post.schema").Post>;
    unlikePost(id: string, req: any): Promise<import("./post.schema").Post>;
    addComment(id: string, req: any, createCommentDto: CreateCommentDto): Promise<import("./post.schema").Post>;
    deletePost(id: string, req: any): Promise<{
        message: string;
    }>;
}
