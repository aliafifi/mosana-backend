import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DaoDocument = Document & Dao;

@Schema({ timestamps: true })
export class Dao {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  logoUrl?: string;

  @Prop({ required: true, index: true })
  creator: string; // Wallet address of DAO creator

  @Prop({ required: true, default: 1000 })
  minTokensRequired: number; // Minimum MOSANA tokens to join

  @Prop({ type: [String], default: [] })
  members: string[]; // Array of wallet addresses

  @Prop({ default: 0 })
  memberCount: number;

  @Prop({ default: 0 })
  proposalCount: number;

  @Prop({ 
    type: String, 
    enum: ['active', 'inactive', 'archived'], 
    default: 'active' 
  })
  status: string;

  @Prop({ default: 7 })
  votingPeriodDays: number; // How long proposals stay open

  @Prop({ default: 51 })
  quorumPercentage: number; // % of members needed to vote

  @Prop({ default: false })
  reputationWeighted: boolean; // Use reputation in voting (for later)

  @Prop({ type: Object, default: {} })
  settings: {
    allowProposalsFrom?: 'anyone' | 'members' | 'creator';
    minTokensToPropose?: number;
    minReputationToPropose?: number;
  };

  @Prop({ default: 0 })
  treasuryBalance: number; // For future treasury management

  @Prop({ type: [String], default: [] })
  tags: string[]; // e.g., ['governance', 'charity', 'art']
}

export const DaoSchema = SchemaFactory.createForClass(Dao);

// Indexes for performance
DaoSchema.index({ creator: 1, createdAt: -1 });
DaoSchema.index({ status: 1, memberCount: -1 });
DaoSchema.index({ members: 1 });
DaoSchema.index({ tags: 1 });
