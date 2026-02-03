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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.Post = exports.CommentSchema = exports.Comment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Comment = class Comment {
    _id;
    walletAddress;
    content;
    gifUrl;
    createdAt;
};
exports.Comment = Comment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, auto: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Comment.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Comment.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 1000 }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, maxlength: 2048 }),
    __metadata("design:type", String)
], Comment.prototype, "gifUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
exports.Comment = Comment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Comment);
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(Comment);
let Post = class Post {
    walletAddress;
    content;
    mediaUrls;
    likesCount;
    likedBy;
    commentsCount;
    comments;
    isNftMinted;
    nftMintAddress;
    ventureId;
    dedicatedCause;
    charityPercentage;
    totalCharityDonations;
    isActive;
    tags;
    viewsCount;
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Post.prototype, "walletAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 5000 }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "mediaUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "likesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [], index: true }),
    __metadata("design:type", Array)
], Post.prototype, "likedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "commentsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.CommentSchema], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "isNftMinted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Post.prototype, "nftMintAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Post.prototype, "ventureId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Cause' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Post.prototype, "dedicatedCause", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "charityPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "totalCharityDonations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Post.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "viewsCount", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Post);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostSchema.index({ walletAddress: 1, createdAt: -1 });
exports.PostSchema.index({ createdAt: -1 });
exports.PostSchema.index({ likesCount: -1 });
exports.PostSchema.index({ tags: 1 });
exports.PostSchema.index({ dedicatedCause: 1, charityPercentage: 1 });
//# sourceMappingURL=post.schema.js.map