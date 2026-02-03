"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("./post.schema");
let PostsService = class PostsService {
    postModel;
    constructor(postModel) {
        this.postModel = postModel;
    }
    async create(walletAddress, createPostDto) {
        const post = await this.postModel.create({
            walletAddress,
            content: createPostDto.content,
            mediaUrls: createPostDto.mediaUrls,
            tags: createPostDto.tags,
            ...(createPostDto.dedicatedCause && { dedicatedCause: createPostDto.dedicatedCause }),
            ...(createPostDto.charityPercentage && { charityPercentage: createPostDto.charityPercentage }),
        });
        return post;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const posts = await this.postModel
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('dedicatedCause')
            .exec();
        return posts;
    }
    async getHomeFeed(walletAddress, following, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const wallets = [walletAddress, ...following];
        const posts = await this.postModel
            .find({
            walletAddress: { $in: wallets },
            isActive: true,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('dedicatedCause')
            .exec();
        return posts;
    }
    async findOne(postId) {
        if (!mongoose_2.Types.ObjectId.isValid(postId)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel.findOne({
            _id: postId,
            isActive: true,
        })
            .populate('dedicatedCause')
            .exec();
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.postModel.findByIdAndUpdate(postId, {
            $inc: { viewsCount: 1 },
        });
        return post;
    }
    async findByUser(walletAddress, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const posts = await this.postModel
            .find({ walletAddress, isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('dedicatedCause')
            .exec();
        return posts;
    }
    async likePost(postId, walletAddress) {
        if (!mongoose_2.Types.ObjectId.isValid(postId)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.likedBy.includes(walletAddress)) {
            throw new common_1.BadRequestException('Already liked this post');
        }
        const updatedPost = await this.postModel.findByIdAndUpdate(postId, {
            $push: { likedBy: walletAddress },
            $inc: { likesCount: 1 },
        }, { new: true })
            .populate('dedicatedCause');
        if (!updatedPost) {
            throw new common_1.NotFoundException('Post not found');
        }
        return updatedPost;
    }
    async unlikePost(postId, walletAddress) {
        if (!mongoose_2.Types.ObjectId.isValid(postId)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (!post.likedBy.includes(walletAddress)) {
            throw new common_1.BadRequestException('You have not liked this post');
        }
        const updatedPost = await this.postModel.findByIdAndUpdate(postId, {
            $pull: { likedBy: walletAddress },
            $inc: { likesCount: -1 },
        }, { new: true })
            .populate('dedicatedCause');
        if (!updatedPost) {
            throw new common_1.NotFoundException('Post not found');
        }
        return updatedPost;
    }
    async addComment(postId, walletAddress, createCommentDto) {
        if (!mongoose_2.Types.ObjectId.isValid(postId)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const comment = {
            _id: new mongoose_2.Types.ObjectId(),
            walletAddress,
            content: createCommentDto.content,
            gifUrl: createCommentDto.gifUrl || null,
            createdAt: new Date(),
        };
        const updatedPost = await this.postModel.findByIdAndUpdate(postId, {
            $push: { comments: comment },
            $inc: { commentsCount: 1 },
        }, { new: true })
            .populate('dedicatedCause');
        if (!updatedPost) {
            throw new common_1.NotFoundException('Post not found');
        }
        return updatedPost;
    }
    async delete(postId, walletAddress) {
        if (!mongoose_2.Types.ObjectId.isValid(postId)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.walletAddress !== walletAddress) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.postModel.findByIdAndUpdate(postId, { isActive: false });
        return { message: 'Post deleted successfully' };
    }
    async getTrending(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const posts = await this.postModel
            .find({ isActive: true })
            .sort({ likesCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('dedicatedCause')
            .exec();
        return posts;
    }
    async getCharityPosts(page = 1, limit = 20) {
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
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PostsService);
//# sourceMappingURL=posts.service.js.map