import { ExportStatus } from '../schemas/export.schema';

export class ExportResultDto {
  exportId: string;
  walletAddress: string;
  status: ExportStatus;
  downloadUrl?: string;
  arweaveUrl?: string;
  arweaveTransactionId?: string;
  fileSize?: number;
  expiresAt?: Date;
  requestedAt: Date;
  completedAt?: Date;
  metadata?: {
    totalPosts?: number;
    totalComments?: number;
    totalTips?: number;
    totalDonations?: number;
    totalNFTs?: number;
  };
}

export class UserDataExportDto {
  exportedAt: Date;
  walletAddress: string;
  
  profile: {
    username?: string;
    bio?: string;
    profilePictureUrl?: string;
    nftPfp?: string;
    solDomain?: string;
    createdAt: Date;
  };

  socialGraph: {
    followers: string[];
    following: string[];
    followerCount: number;
    followingCount: number;
  };

  posts: Array<{
    id: string;
    content: string;
    mediaUrls?: string[];
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
    dedicatedCause?: string;
    charityPercentage?: number;
  }>;

  comments: Array<{
    postId: string;
    content: string;
    gifUrl?: string;
    createdAt: Date;
  }>;

  reputation: {
    totalScore: number;
    level: string;
    rewardMultiplier: number;
    breakdown: any;
    badges: string[];
    lastCalculated: Date;
  };

  tipping: {
    sent: Array<{
      amount: number;
      currency: string;
      toWallet: string;
      postId?: string;
      createdAt: Date;
    }>;
    received: Array<{
      amount: number;
      currency: string;
      fromWallet: string;
      postId?: string;
      createdAt: Date;
    }>;
    totalSent: number;
    totalReceived: number;
  };

  donations: {
    history: Array<{
      causeId: string;
      causeName?: string;
      amount: number;
      createdAt: Date;
    }>;
    totalDonated: number;
  };

  nfts: Array<{
    mintAddress: string;
    postId: string;
    metadataUri: string;
    royaltyPercentage: number;
    createdAt: Date;
  }>;

  daos: {
    joined: Array<{
      daoId: string;
      name: string;
      joinedAt: Date;
    }>;
    proposals: Array<{
      proposalId: string;
      daoId: string;
      title: string;
      createdAt: Date;
    }>;
    votes: Array<{
      proposalId: string;
      vote: string;
      createdAt: Date;
    }>;
  };

  ventures: Array<{
    ventureId: string;
    postId: string;
    sharePercentage: number;
    totalEarnings: number;
    status: string;
    createdAt: Date;
  }>;

  rewards: {
    totalEarned: number;
    history: Array<{
      amount: number;
      date: Date;
      status: string;
    }>;
  };

  verification: {
    isVerified: boolean;
    verifications: Array<{
      provider: string;
      status: string;
      verifiedAt?: Date;
      expiresAt?: Date;
    }>;
  };
}
