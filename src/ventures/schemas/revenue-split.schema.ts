import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RevenueSplitDocument = RevenueSplit & Document;

// Individual payment to a collaborator
class CollaboratorPayment {
  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  sharePercentage: number;

  @Prop()
  transactionHash?: string; // Solana transaction hash
}

@Schema({ timestamps: true })
export class RevenueSplit {
  // Link to the venture
  @Prop({ type: Types.ObjectId, ref: 'Venture', required: true, index: true })
  ventureId: Types.ObjectId;

  // Link to the post
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  // Total amount received (before split)
  @Prop({ required: true })
  totalAmount: number;

  // Source of revenue
  @Prop({ 
    type: String, 
    enum: ['tip', 'nft-sale', 'royalty', 'other'],
    required: true 
  })
  source: string;

  // All payments made to collaborators
  @Prop({ type: [CollaboratorPayment], required: true })
  payments: CollaboratorPayment[];

  // Who sent the original payment (for tips)
  @Prop()
  sender?: string;

  // Optional: Link to tip or NFT transaction
  @Prop()
  sourceTransactionId?: string;
}

export const RevenueSplitSchema = SchemaFactory.createForClass(RevenueSplit);

// Indexes
RevenueSplitSchema.index({ ventureId: 1, createdAt: -1 });
RevenueSplitSchema.index({ postId: 1 });
RevenueSplitSchema.index({ 'payments.walletAddress': 1 });
