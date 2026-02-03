import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CauseDocument = Cause & Document;

@Schema({ timestamps: true })
export class Cause {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true, index: true })
  walletAddress: string;

  @Prop({ required: true })
  category: string; // e.g., "education", "healthcare", "environment", "poverty"

  @Prop()
  website?: string;

  @Prop()
  logo?: string;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  totalDonationsReceived: number;

  @Prop({ default: 0 })
  totalDonors: number;
}

export const CauseSchema = SchemaFactory.createForClass(Cause);

CauseSchema.index({ category: 1, isActive: 1 });
CauseSchema.index({ totalDonationsReceived: -1 });
