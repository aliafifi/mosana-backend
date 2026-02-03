import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExportDocument = Export & Document;

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
}

@Schema({ timestamps: true })
export class Export {
  @Prop({ required: true, index: true })
  walletAddress: string;

  @Prop({ 
    required: true, 
    enum: Object.values(ExportStatus),
    default: ExportStatus.PENDING 
  })
  status: ExportStatus;

  @Prop({ 
    required: true, 
    enum: Object.values(ExportFormat),
    default: ExportFormat.JSON 
  })
  format: ExportFormat;

  @Prop({ required: false })
  arweaveUrl?: string; // Permanent storage URL

  @Prop({ required: false })
  arweaveTransactionId?: string;

  @Prop({ required: false })
  downloadUrl?: string; // Temporary download link

  @Prop({ required: false })
  fileSize?: number; // Size in bytes

  @Prop({ required: false })
  expiresAt?: Date; // When download link expires

  @Prop({ required: false })
  errorMessage?: string;

  @Prop({ type: Object, required: false })
  metadata?: {
    totalPosts?: number;
    totalComments?: number;
    totalTips?: number;
    totalDonations?: number;
    totalNFTs?: number;
    exportDuration?: number; // milliseconds
  };

  @Prop({ required: true })
  requestedAt: Date;

  @Prop({ required: false })
  completedAt?: Date;
}

export const ExportSchema = SchemaFactory.createForClass(Export);

// Indexes for efficient queries
ExportSchema.index({ walletAddress: 1, createdAt: -1 });
ExportSchema.index({ status: 1 });
ExportSchema.index({ expiresAt: 1 });
