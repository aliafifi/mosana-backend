import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// This line creates a TypeScript type for our NFT documents
export type NftDocument = Nft & Document;

// @Schema decorator tells Mongoose this is a database model
// { timestamps: true } automatically adds createdAt and updatedAt fields
@Schema({ timestamps: true })
export class Nft {
  
  // Link to the original post
  // 'type: Types.ObjectId' means this stores a MongoDB ID
  // 'ref: 'Post'' creates a relationship to the Post collection
  // 'required: true' means you MUST provide this when creating an NFT
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  // The NFT's address on Solana blockchain
  // 'unique: true' means no two NFTs can have the same address
  // 'index: true' makes database searches faster
  @Prop({ required: true, unique: true, index: true })
  mintAddress: string;

  // Permanent link to NFT metadata on Arweave
  @Prop({ required: true })
  metadataUri: string;

  // Wallet address of the person who created/minted the NFT
  @Prop({ required: true, index: true })
  creator: string;

  // Current owner (can change if NFT is sold)
  // Initially same as creator
  @Prop({ required: true, index: true })
  owner: string;

  // Percentage creator earns on resales (0-50%)
  // 'default: 5' means if not specified, use 5%
  // 'min: 0, max: 50' enforces Solana's royalty limits
  @Prop({ 
    required: true, 
    default: 5,
    min: 0,
    max: 50 
  })
  royaltyPercentage: number;

  // Has this NFT been burned (destroyed)?
  @Prop({ default: false })
  isBurned: boolean;

  // Optional: Store the blockchain transaction hash
  // Useful for users to verify the mint on Solscan
  @Prop()
  transactionHash?: string;

  // Optional: Store a snapshot of engagement at mint time
  // This preserves how popular the post was when immortalized
  @Prop({ type: Object })
  engagementSnapshot?: {
    likes: number;
    comments: number;
    tips: number;
  };
}

// Create the Mongoose schema from our class
// This is what NestJS will use to interact with MongoDB
export const NftSchema = SchemaFactory.createForClass(Nft);

// Add indexes for common queries
// These make database searches MUCH faster
NftSchema.index({ creator: 1, createdAt: -1 }); // Get user's NFTs sorted by newest
NftSchema.index({ postId: 1 }); // Check if a post is already minted
