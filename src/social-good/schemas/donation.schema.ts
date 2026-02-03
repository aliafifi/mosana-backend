import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DonationDocument = Donation & Document;

@Schema({ timestamps: true })
export class Donation {
  @Prop({ required: true, index: true })
  donorWallet: string;

  @Prop({ type: Types.ObjectId, ref: 'Cause', required: true, index: true })
  causeId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  pledgePercentage: number;

  @Prop({ required: true })
  source: string; // 'tip', 'nft-sale', 'venture-split', 'manual'

  @Prop({ required: true })
  originalAmount: number; // Total amount before pledge split

  @Prop()
  sourceTransactionId?: string;

  @Prop()
  donationTransactionHash?: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

DonationSchema.index({ donorWallet: 1, createdAt: -1 });
DonationSchema.index({ causeId: 1, createdAt: -1 });
