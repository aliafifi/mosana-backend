import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerificationDocument = Verification & Document;

// Supported verification providers
export enum VerificationProvider {
  CIVIC_CAPTCHA = 'civic-captcha',
  CIVIC_LIVENESS = 'civic-liveness',
  CIVIC_UNIQUENESS = 'civic-uniqueness',
  CIVIC_ID = 'civic-id',
  HUMANITY_PROTOCOL = 'humanity-protocol',
  CUSTOM = 'custom',
}

// Verification status
export enum VerificationStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Verification {
  @Prop({ required: true, index: true })
  walletAddress: string;

  @Prop({ 
    required: true, 
    enum: Object.values(VerificationProvider),
    index: true 
  })
  provider: VerificationProvider;

  @Prop({ 
    required: true, 
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING 
  })
  status: VerificationStatus;

  // On-chain attestation details
  @Prop({ required: false })
  attestationAddress?: string; // PDA of the attestation on Solana

  @Prop({ required: false })
  credentialAddress?: string; // PDA of the credential

  @Prop({ required: false })
  schemaAddress?: string; // PDA of the schema

  // Verification metadata
  @Prop({ required: true })
  verifiedAt: Date;

  @Prop({ required: false })
  expiresAt?: Date;

  @Prop({ required: false })
  lastCheckedAt?: Date;

  // Transaction details
  @Prop({ required: false })
  transactionSignature?: string;

  // Multiplier bonus this verification provides
  @Prop({ required: true, default: 1.0 })
  multiplierBonus: number;

  // Additional metadata
  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;

  // Admin notes
  @Prop({ required: false })
  revokedBy?: string;

  @Prop({ required: false })
  revocationReason?: string;

  @Prop({ required: false })
  revokedAt?: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

// Indexes for efficient queries
VerificationSchema.index({ walletAddress: 1, status: 1 });
VerificationSchema.index({ provider: 1, status: 1 });
VerificationSchema.index({ expiresAt: 1 });
VerificationSchema.index({ createdAt: -1 });
