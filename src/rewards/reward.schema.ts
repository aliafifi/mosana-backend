import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;
export type DailyEngagementDocument = DailyEngagement & Document;

// Daily engagement tracking per user
@Schema({ timestamps: true })
export class DailyEngagement {
  @Prop({ required: true, index: true })
  walletAddress: string;

  @Prop({ required: true })
  date: Date; // The day this tracks (YYYY-MM-DD)

  @Prop({ default: 0 })
  postsCreated: number;

  @Prop({ default: 0 })
  likesReceived: number;

  @Prop({ default: 0 })
  commentsReceived: number;

  @Prop({ default: 0 })
  viewsReceived: number;

  @Prop({ default: 0 })
  likesGiven: number;

  @Prop({ default: 0 })
  commentsGiven: number;

  @Prop({ default: 0 })
  totalPoints: number; // Calculated total engagement points

  @Prop({ default: 0 })
  tokensEarned: number; // $MOSANA tokens earned for this day

  @Prop({ default: false })
  isDistributed: boolean; // Has this day's reward been distributed?
}

export const DailyEngagementSchema = SchemaFactory.createForClass(DailyEngagement);

// Reward distribution history
@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true, index: true })
  walletAddress: string;

  @Prop({ required: true })
  amount: number; // Tokens distributed

  @Prop({ required: true })
  date: Date; // Distribution date

  @Prop({ required: true })
  engagementPoints: number; // Points that earned this reward

  @Prop({ required: true })
  transactionSignature: string; // Solana transaction hash

  @Prop({ default: 'completed' })
  status: string; // completed, pending, failed
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

// Create indexes for performance
DailyEngagementSchema.index({ walletAddress: 1, date: -1 }); // User's daily engagement
DailyEngagementSchema.index({ date: -1, isDistributed: 1 }); // Pending distributions
RewardSchema.index({ walletAddress: 1, date: -1 }); // User's reward history
