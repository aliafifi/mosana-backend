import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

// Comment subdocument
@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Prop({ default: null, maxlength: 2048 })
  gifUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Main Post schema
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, index: true })
  walletAddress: string; // Author's wallet

  @Prop({ required: true, maxlength: 5000 })
  content: string; // Post text content

  @Prop({ type: [String], default: [] })
  mediaUrls: string[]; // Array of image/video URLs

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ type: [String], default: [], index: true })
  likedBy: string[]; // Array of wallet addresses who liked

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ default: false })
  isNftMinted: boolean; // For Feature 4: Immortal Posts

  @Prop({ default: null })
  nftMintAddress: string; // NFT mint address if minted

  @Prop({ default: null })
  ventureId: string; // For Feature 5: Collaborative Ventures

  // ===== CHARITY DONATION FIELDS (Feature 8: Social Good) =====
  @Prop({ type: Types.ObjectId, ref: 'Cause' })
  dedicatedCause?: Types.ObjectId; // Which charity this post supports (optional)

  @Prop({ min: 0, max: 100, default: 0 })
  charityPercentage?: number; // % of earnings going to charity (optional)

  @Prop({ default: 0 })
  totalCharityDonations?: number; // Running total donated from this post (optional)

  @Prop({ default: true })
  isActive: boolean; // Soft delete flag

  @Prop({ type: [String], default: [] })
  tags: string[]; // Hashtags

  @Prop({ default: 0 })
  viewsCount: number; // Track engagement for rewards
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Create indexes for performance
PostSchema.index({ walletAddress: 1, createdAt: -1 }); // User's posts
PostSchema.index({ createdAt: -1 }); // Global feed
PostSchema.index({ likesCount: -1 }); // Trending posts
PostSchema.index({ tags: 1 }); // Search by tags
PostSchema.index({ dedicatedCause: 1, charityPercentage: 1 }); // Charity posts
