import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  walletAddress: string;

  @Prop({ default: null })
  username: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: null })
  profileImage: string;

  @Prop({ default: null })
  nftProfilePicture: string; // NFT mint address for verified PFP

  @Prop({ default: null })
  solDomain: string; // e.g., "mosana.sol"

  @Prop({ default: 0 })
  totalEarned: number; // Total $MOSANA tokens earned

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ type: [String], default: [] })
  following: string[]; // Array of wallet addresses

  @Prop({ default: null })
  charityPledgePercentage: number; // For Social Good Engine

  @Prop({ default: null })
  selectedCause: string; // Charity wallet address

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
