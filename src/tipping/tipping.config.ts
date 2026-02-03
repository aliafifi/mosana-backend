export const TIPPING_CONFIG = {
  // Tiered fee structure - Lowest in crypto social! 🔥
  calculateFee(amount: number): { 
    totalFee: number; 
    burned: number; 
    toRewards: number;
    feePercentage: number;
  } {
    let feePercentage: number;
    
    // Tiered structure (fair to all users)
    if (amount <= 100) {
      feePercentage = 0.01; // 1% for small tips
    } else if (amount <= 1000) {
      feePercentage = 0.0075; // 0.75% for medium tips
    } else if (amount <= 10000) {
      feePercentage = 0.005; // 0.5% for large tips
    } else {
      feePercentage = 0.0025; // 0.25% for whale tips (BEST RATE!)
    }
    
    const totalFee = Math.floor(amount * feePercentage);
    const burned = Math.floor(totalFee * 0.5); // 50% BURNED 🔥
    const toRewards = totalFee - burned; // 50% to rewards pool
    
    return { 
      totalFee, 
      burned, 
      toRewards,
      feePercentage: feePercentage * 100, // For display (e.g., 0.75)
    };
  },

  // Minimum tip amount (prevent spam)
  MIN_TIP_AMOUNT: 10, // 10 tokens minimum

  // Maximum tip amount (reasonable cap)
  MAX_TIP_AMOUNT: 10_000_000, // 10M tokens max

  // Currency options
  SUPPORTED_CURRENCIES: ['MOSANA', 'SOL'],

  // Fee split explanation (for transparency)
  FEE_SPLIT: {
    BURN_PERCENTAGE: 0.5, // 50% burned (deflationary)
    REWARDS_PERCENTAGE: 0.5, // 50% to rewards pool
  },

  // Display tiers (for UI/documentation)
  FEE_TIERS: [
    { name: 'Small', max: 100, fee: '1%', description: 'Tips up to 100 tokens' },
    { name: 'Medium', max: 1000, fee: '0.75%', description: 'Tips 101-1,000 tokens' },
    { name: 'Large', max: 10000, fee: '0.5%', description: 'Tips 1,001-10,000 tokens' },
    { name: 'Whale', max: Infinity, fee: '0.25%', description: 'Tips over 10,000 tokens' },
  ],

  // Get fee tier name for display
  getTierName(amount: number): string {
    if (amount <= 100) return 'Small';
    if (amount <= 1000) return 'Medium';
    if (amount <= 10000) return 'Large';
    return 'Whale';
  },

  // Validate tip amount
  isValidTipAmount(amount: number): { valid: boolean; error?: string } {
    if (amount < this.MIN_TIP_AMOUNT) {
      return { 
        valid: false, 
        error: `Minimum tip is ${this.MIN_TIP_AMOUNT} tokens` 
      };
    }
    if (amount > this.MAX_TIP_AMOUNT) {
      return { 
        valid: false, 
        error: `Maximum tip is ${this.MAX_TIP_AMOUNT} tokens` 
      };
    }
    return { valid: true };
  },
};
