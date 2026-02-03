export const TOKENOMICS = {
  // Total Supply (Fixed)
  TOTAL_SUPPLY: 10_000_000_000, // 10 billion $MOSANA

  // Allocation (From Whitepaper)
  COMMUNITY_POOL: 4_500_000_000, // 45%
  TEAM_ALLOCATION: 2_000_000_000, // 20%
  TREASURY: 1_500_000_000, // 15%
  PRESALE: 1_500_000_000, // 15%
  LIQUIDITY: 500_000_000, // 5%

  // Rewards Distribution Schedule (Per Year)
  // Hybrid Model: Higher early, declining for scarcity
  REWARDS_SCHEDULE: {
    2026: 600_000_000, // Year 1: 600M tokens
    2027: 550_000_000, // Year 2: 550M tokens
    2028: 500_000_000, // Year 3: 500M tokens
    2029: 450_000_000, // Year 4: 450M tokens
    2030: 400_000_000, // Year 5: 400M tokens
    2031: 375_000_000, // Year 6: 375M tokens
    2032: 350_000_000, // Year 7: 350M tokens
    2033: 325_000_000, // Year 8: 325M tokens
    2034: 300_000_000, // Year 9: 300M tokens
    2035: 250_000_000, // Year 10: 250M tokens
    // Total: 4,100,000,000 over 10 years
    // Remaining 400M reserved for future community grants
  },

  // Calculate daily pool based on year
  getDailyPool(year: number): number {
    const yearlyAllocation = this.REWARDS_SCHEDULE[year] || 250_000_000; // Default to 250M after 2035
    return Math.floor(yearlyAllocation / 365);
  },

  // Engagement Point Values (Adjustable based on analytics)
  POINTS: {
    POST_CREATED: 10, // Creating quality content
    LIKE_RECEIVED: 5, // Popular content
    COMMENT_RECEIVED: 8, // Engaging content
    VIEW_RECEIVED: 1, // Reach
    LIKE_GIVEN: 1, // Good curation
    COMMENT_GIVEN: 2, // Active participation
  },

  // Calculate total points for a user's daily engagement
  calculatePoints(engagement: {
    postsCreated: number;
    likesReceived: number;
    commentsReceived: number;
    viewsReceived: number;
    likesGiven: number;
    commentsGiven: number;
  }): number {
    return (
      engagement.postsCreated * this.POINTS.POST_CREATED +
      engagement.likesReceived * this.POINTS.LIKE_RECEIVED +
      engagement.commentsReceived * this.POINTS.COMMENT_RECEIVED +
      engagement.viewsReceived * this.POINTS.VIEW_RECEIVED +
      engagement.likesGiven * this.POINTS.LIKE_GIVEN +
      engagement.commentsGiven * this.POINTS.COMMENT_GIVEN
    );
  },

  // Minimum points to qualify for rewards (anti-spam)
  MINIMUM_POINTS_FOR_REWARD: 10, // Must earn at least 10 points/day

  // Maximum points per day (anti-gaming)
  // Prevents one user from dominating through spam
  MAX_POINTS_PER_DAY: 10_000, // Cap at 10,000 points/day per user
};
