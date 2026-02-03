import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// This makes TypeScript happy when working with MongoDB documents
export type ReputationDocument = Reputation & Document;

// ============================================
// MAIN REPUTATION SCHEMA
// ============================================
@Schema({
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
  collection: 'reputations',  // MongoDB collection name
})
export class Reputation {
  // ============================================
  // CORE IDENTITY
  // ============================================
  
  @Prop({ required: true, unique: true, index: true })
  walletAddress: string;  // e.g., "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

  @Prop({ default: 0, min: 0, max: 1000, index: true })
  totalScore: number;  // Main reputation score (0-1000)

  @Prop({
    type: String,
    enum: ['New', 'Active', 'Trusted', 'Veteran', 'Legend'],
    default: 'New',
    index: true,
  })
  level: string;  // Reputation tier based on totalScore

  // ============================================
  // SCORE BREAKDOWN (7 CATEGORIES)
  // ============================================
  
  @Prop({
    type: Object,
    default: {
      accountAge: { points: 0, maxPoints: 100 },
      engagement: { points: 0, maxPoints: 250 },
      economic: { points: 0, maxPoints: 200 },
      socialGood: { points: 0, maxPoints: 150 },
      dao: { points: 0, maxPoints: 100 },
      nft: { points: 0, maxPoints: 100 },
      trust: { points: 0, maxPoints: 100 },
    },
  })
  breakdown: {
    accountAge: { points: number; maxPoints: number };    // Time since first activity
    engagement: { points: number; maxPoints: number };    // Posts, likes, comments
    economic: { points: number; maxPoints: number };      // Tips received/sent
    socialGood: { points: number; maxPoints: number };    // Charity donations
    dao: { points: number; maxPoints: number };           // DAO participation
    nft: { points: number; maxPoints: number };           // NFT activity
    trust: { points: number; maxPoints: number };         // Weighted tips from trusted users
  };

  // ============================================
  // ACTIVITY METRICS (Raw Data)
  // ============================================
  
  @Prop({
    type: Object,
    default: {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      tipsReceived: 0,
      tipsSent: 0,
      nftsMinted: 0,
      nftsSold: 0,
      nftRevenue: 0,
      charityDonations: 0,
      daosJoined: 0,
      proposalsCreated: 0,
      votesCast: 0,
      venturesJoined: 0,
    },
  })
  metrics: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    tipsReceived: number;         // Total MOSANA received
    tipsSent: number;             // Total MOSANA sent
    nftsMinted: number;
    nftsSold: number;
    nftRevenue: number;           // Total SOL from NFT sales
    charityDonations: number;     // Total MOSANA donated
    daosJoined: number;
    proposalsCreated: number;
    votesCast: number;
    venturesJoined: number;
  };

  // ============================================
  // PENALTIES
  // ============================================
  
  @Prop({ type: Array, default: [] })
  penalties: Array<{
    reason: string;      // e.g., 'spam_report', 'sybil_pattern'
    points: number;      // Negative value (e.g., -50)
    date: Date;
    adminWallet?: string;  // If manually applied
    details?: string;
  }>;

  // ============================================
  // BADGES & ACHIEVEMENTS
  // ============================================
  
  @Prop({ type: [String], default: [] })
  badges: string[];  // e.g., ['early_adopter', 'charity_champion']

  // ============================================
  // METADATA
  // ============================================
  
  @Prop({ default: Date.now })
  lastCalculated: Date;  // Last time score was recalculated

  @Prop({ default: Date.now })
  firstActivity: Date;  // User's join date (for account age)

  @Prop({ default: 1.0, min: 0, max: 5 })
  rewardMultiplier: number;  // Reward boost based on level (1.0x - 3.0x)

  @Prop({ default: false })
  isFlagged: boolean;  // True if suspicious activity detected

  @Prop()
  flagReason?: string;  // Why the account was flagged

  @Prop({ default: 0 })
  calculationCount: number;  // How many times recalculated (for debugging)
}

// Create the schema
export const ReputationSchema = SchemaFactory.createForClass(Reputation);

// ============================================
// INDEXES (for fast database queries)
// ============================================

ReputationSchema.index({ totalScore: -1 });  // Leaderboard (highest first)
ReputationSchema.index({ level: 1, totalScore: -1 });  // Filter by level
ReputationSchema.index({ isFlagged: 1 });  // Find suspicious accounts
ReputationSchema.index({ walletAddress: 1, lastCalculated: -1 });  // User lookup
