export declare const TIPPING_CONFIG: {
    calculateFee(amount: number): {
        totalFee: number;
        burned: number;
        toRewards: number;
        feePercentage: number;
    };
    MIN_TIP_AMOUNT: number;
    MAX_TIP_AMOUNT: number;
    SUPPORTED_CURRENCIES: string[];
    FEE_SPLIT: {
        BURN_PERCENTAGE: number;
        REWARDS_PERCENTAGE: number;
    };
    FEE_TIERS: {
        name: string;
        max: number;
        fee: string;
        description: string;
    }[];
    getTierName(amount: number): string;
    isValidTipAmount(amount: number): {
        valid: boolean;
        error?: string;
    };
};
