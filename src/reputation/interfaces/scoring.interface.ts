// ============================================
// SCORING CONFIGURATION
// This defines how many points each activity is worth
// ============================================

export interface ScoringConfig {
  accountAge: {
    maxPoints: number;          // Maximum points from account age
    daysForMaxScore: number;    // Days needed to reach max (e.g., 365 = 1 year)
  };
  
  engagement: {
    maxPoints: number;          // Maximum points from posts/likes/comments
    pointsPerPost: number;      // Points earned per post
    pointsPerLike: number;      // Points earned per like received
    pointsPerComment: number;   // Points earned per comment
    spamThreshold: number;      // Posts per day that triggers spam check
  };
  
  economic: {
    maxPoints: number;          // Maximum points from tipping activity
    mosanaPerPoint: number;     // MOSANA needed to earn 1 point (e.g., 100 MOSANA = 1 pt)
    tipWeightRecent: number;    // Weight for tips in last 30 days (higher = worth more)
    tipWeightOld: number;       // Weight for older tips
  };
  
  socialGood: {
    maxPoints: number;          // Maximum points from charity donations
    mosanaPerPoint: number;     // MOSANA donated per point
    consistencyBonus: number;   // Bonus for regular donations
    minimumForBonus: number;    // Minimum donations needed for bonus
  };
  
  dao: {
    maxPoints: number;
    pointsPerDao: number;           // Points for joining a DAO
    pointsPerProposal: number;      // Points for creating a proposal
    pointsPerVote: number;          // Points for voting
    failedProposalPenalty: number;  // Penalty for rejected proposals
  };
  
  nft: {
    maxPoints: number;
    pointsPerMint: number;      // Points for minting an NFT
    pointsPerSale: number;      // Points for selling an NFT
    revenuePerPoint: number;    // SOL revenue needed per point
  };
  
  trust: {
    maxPoints: number;
    highRepThreshold: number;   // Score needed to be a "trusted tipper"
    weightMultiplier: number;   // Tips from trusted users worth this much more
  };
}

// ============================================
// DEFAULT SCORING VALUES
// These are the actual numbers we'll use
// ============================================

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  accountAge: {
    maxPoints: 100,
    daysForMaxScore: 365,  // 1 year for max points
  },
  
  engagement: {
    maxPoints: 250,
    pointsPerPost: 5,       // Each post = 5 points
    pointsPerLike: 0.5,     // Each like = 0.5 points
    pointsPerComment: 2,    // Each comment = 2 points
    spamThreshold: 50,      // 50+ posts/day = potential spam
  },
  
  economic: {
    maxPoints: 200,
    mosanaPerPoint: 100,    // 100 MOSANA tipped = 1 point
    tipWeightRecent: 1.5,   // Recent tips worth 1.5x
    tipWeightOld: 0.5,      // Old tips worth 0.5x
  },
  
  socialGood: {
    maxPoints: 150,
    mosanaPerPoint: 50,     // Charity donations worth double (50 MOSANA = 1 pt)
    consistencyBonus: 20,   // +20 points for regular giving
    minimumForBonus: 5,     // Need 5+ donations
  },
  
  dao: {
    maxPoints: 100,
    pointsPerDao: 10,           // +10 for joining a DAO
    pointsPerProposal: 15,      // +15 for creating a proposal
    pointsPerVote: 2,           // +2 for each vote
    failedProposalPenalty: -10, // -10 if proposal gets rejected
  },
  
  nft: {
    maxPoints: 100,
    pointsPerMint: 20,      // +20 for minting an NFT
    pointsPerSale: 10,      // +10 for selling an NFT
    revenuePerPoint: 0.1,   // 0.1 SOL revenue = 1 point
  },
  
  trust: {
    maxPoints: 100,
    highRepThreshold: 500,  // 500+ score = "trusted user"
    weightMultiplier: 2.0,  // Tips from trusted users worth 2x
  },
};

// ============================================
// PENALTY PRESETS
// Standard point deductions for violations
// ============================================

export const PENALTY_PRESETS = {
  spam_report: -50,                 // Reported for spam
  sybil_pattern: -100,              // Detected as fake account
  failed_proposal_majority: -10,    // Proposal rejected by >70% votes
  zero_charity_90days: -20,         // No charity in 90 days
  rapid_account_creation: -100,     // Multiple accounts from same source
  fake_engagement: -75,             // Bot-like activity
  admin_warning: -25,               // Manual warning from admin
  admin_suspension: -200,           // Manual suspension
};

// ============================================
// BADGE DEFINITIONS
// Achievements users can earn
// ============================================

export interface Badge {
  id: string;             // Unique identifier
  name: string;           // Display name
  description: string;    // What it means
  icon: string;           // Emoji icon
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined Mosana in the first 1000 users',
    icon: '🌟',
  },
  {
    id: 'charity_champion',
    name: 'Charity Champion',
    description: 'Donated 10,000+ MOSANA to charity',
    icon: '💚',
  },
  {
    id: 'dao_leader',
    name: 'DAO Leader',
    description: 'Created 3+ successful proposals',
    icon: '🏛️',
  },
  {
    id: 'nft_artist',
    name: 'NFT Artist',
    description: 'Minted 10+ NFTs',
    icon: '🎨',
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    description: 'Received 50,000+ MOSANA in tips',
    icon: '🏆',
  },
  {
    id: 'legend',
    name: 'Living Legend',
    description: 'Achieved Legend status (750+ score)',
    icon: '👑',
  },
];
