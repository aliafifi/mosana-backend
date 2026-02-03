import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProposalDocument = Document & Proposal;

@Schema({ _id: false })
export class Vote {
  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: true, enum: ['yes', 'no', 'abstain'] })
  vote: string;

  @Prop({ default: 1 })
  weight: number; // For reputation-weighted voting later

  @Prop({ default: Date.now })
  votedAt: Date;
}

@Schema({ timestamps: true })
export class Proposal {
  @Prop({ type: Types.ObjectId, ref: 'Dao', required: true, index: true })
  daoId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  proposer: string; // Wallet address

  @Prop({ 
    type: String, 
    enum: ['active', 'passed', 'rejected', 'expired', 'executed'], 
    default: 'active',
    index: true
  })
  status: string;

  @Prop({ required: true })
  votingStartsAt: Date;

  @Prop({ required: true, index: true })
  votingEndsAt: Date;

  @Prop({ type: [Vote], default: [] })
  votes: Vote[];

  @Prop({ default: 0 })
  yesVotes: number;

  @Prop({ default: 0 })
  noVotes: number;

  @Prop({ default: 0 })
  abstainVotes: number;

  @Prop({ default: 0 })
  totalVotes: number;

  @Prop({ default: 0 })
  participationRate: number; // % of members who voted

  @Prop({ default: null })
  executedAt?: Date;

  @Prop({ default: null })
  executedBy?: string; // Wallet address

  @Prop({ default: null })
  executionTransactionHash?: string; // For on-chain execution later

  @Prop({ type: Object, default: {} })
  metadata: {
    category?: string; // 'governance', 'treasury', 'feature', etc.
    attachments?: string[]; // URLs to documents/images
    discussionUrl?: string; // Link to forum/discord
  };
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);

// Indexes for performance
ProposalSchema.index({ daoId: 1, createdAt: -1 });
ProposalSchema.index({ proposer: 1, createdAt: -1 });
ProposalSchema.index({ status: 1, votingEndsAt: 1 });
ProposalSchema.index({ 'votes.walletAddress': 1 });
