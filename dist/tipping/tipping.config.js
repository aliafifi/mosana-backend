"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIPPING_CONFIG = void 0;
exports.TIPPING_CONFIG = {
    calculateFee(amount) {
        let feePercentage;
        if (amount <= 100) {
            feePercentage = 0.01;
        }
        else if (amount <= 1000) {
            feePercentage = 0.0075;
        }
        else if (amount <= 10000) {
            feePercentage = 0.005;
        }
        else {
            feePercentage = 0.0025;
        }
        const totalFee = Math.floor(amount * feePercentage);
        const burned = Math.floor(totalFee * 0.5);
        const toRewards = totalFee - burned;
        return {
            totalFee,
            burned,
            toRewards,
            feePercentage: feePercentage * 100,
        };
    },
    MIN_TIP_AMOUNT: 10,
    MAX_TIP_AMOUNT: 10_000_000,
    SUPPORTED_CURRENCIES: ['MOSANA', 'SOL'],
    FEE_SPLIT: {
        BURN_PERCENTAGE: 0.5,
        REWARDS_PERCENTAGE: 0.5,
    },
    FEE_TIERS: [
        { name: 'Small', max: 100, fee: '1%', description: 'Tips up to 100 tokens' },
        { name: 'Medium', max: 1000, fee: '0.75%', description: 'Tips 101-1,000 tokens' },
        { name: 'Large', max: 10000, fee: '0.5%', description: 'Tips 1,001-10,000 tokens' },
        { name: 'Whale', max: Infinity, fee: '0.25%', description: 'Tips over 10,000 tokens' },
    ],
    getTierName(amount) {
        if (amount <= 100)
            return 'Small';
        if (amount <= 1000)
            return 'Medium';
        if (amount <= 10000)
            return 'Large';
        return 'Whale';
    },
    isValidTipAmount(amount) {
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
//# sourceMappingURL=tipping.config.js.map