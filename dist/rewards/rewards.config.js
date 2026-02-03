"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKENOMICS = void 0;
exports.TOKENOMICS = {
    TOTAL_SUPPLY: 10_000_000_000,
    COMMUNITY_POOL: 4_500_000_000,
    TEAM_ALLOCATION: 2_000_000_000,
    TREASURY: 1_500_000_000,
    PRESALE: 1_500_000_000,
    LIQUIDITY: 500_000_000,
    REWARDS_SCHEDULE: {
        2026: 600_000_000,
        2027: 550_000_000,
        2028: 500_000_000,
        2029: 450_000_000,
        2030: 400_000_000,
        2031: 375_000_000,
        2032: 350_000_000,
        2033: 325_000_000,
        2034: 300_000_000,
        2035: 250_000_000,
    },
    getDailyPool(year) {
        const yearlyAllocation = this.REWARDS_SCHEDULE[year] || 250_000_000;
        return Math.floor(yearlyAllocation / 365);
    },
    POINTS: {
        POST_CREATED: 10,
        LIKE_RECEIVED: 5,
        COMMENT_RECEIVED: 8,
        VIEW_RECEIVED: 1,
        LIKE_GIVEN: 1,
        COMMENT_GIVEN: 2,
    },
    calculatePoints(engagement) {
        return (engagement.postsCreated * this.POINTS.POST_CREATED +
            engagement.likesReceived * this.POINTS.LIKE_RECEIVED +
            engagement.commentsReceived * this.POINTS.COMMENT_RECEIVED +
            engagement.viewsReceived * this.POINTS.VIEW_RECEIVED +
            engagement.likesGiven * this.POINTS.LIKE_GIVEN +
            engagement.commentsGiven * this.POINTS.COMMENT_GIVEN);
    },
    MINIMUM_POINTS_FOR_REWARD: 10,
    MAX_POINTS_PER_DAY: 10_000,
};
//# sourceMappingURL=rewards.config.js.map