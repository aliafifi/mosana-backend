import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TipDocument = Tip & Document;

@Schema({ timestamps: true })
export class Tip {
  @Prop({ required: true, index: true })
  fromWallet: string;

  @Prop({ required: true, index: true })
  toWallet: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 0 })
  platformFee: number; // Total fee charged

  @Prop({ default: 0 })
  feePercentage: number; // Fee percentage (0.25%, 0.5%, 0.75%, or 1%)

  @Prop({ default: 0 })
  amountBurned: number; // 50% of fee - BURNED 🔥

  @Prop({ default: 0 })
  amountToRewards: number; // 50% of fee - To rewards pool

  @Prop({ required: true })
  transactionSignature: string;

  @Prop({ default: null })
  postId: string;

  @Prop({ default: null })
  commentId: string;

  @Prop({ default: null })
  message: string;

  @Prop({ default: 'completed' })
  status: string;

  @Prop({ default: Date.now })
  tippedAt: Date;
}

export const TipSchema = SchemaFactory.createForClass(Tip);

// Create indexes for performance
TipSchema.index({ fromWallet: 1, createdAt: -1 }); // Sent tips
TipSchema.index({ toWallet: 1, createdAt: -1 }); // Received tips
TipSchema.index({ postId: 1 }); // Tips on a post
TipSchema.index({ transactionSignature: 1 }, { unique: true }); // Prevent duplicates
