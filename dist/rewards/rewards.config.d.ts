export declare const TOKENOMICS: {
    TOTAL_SUPPLY: number;
    COMMUNITY_POOL: number;
    TEAM_ALLOCATION: number;
    TREASURY: number;
    PRESALE: number;
    LIQUIDITY: number;
    REWARDS_SCHEDULE: {
        2026: number;
        2027: number;
        2028: number;
        2029: number;
        2030: number;
        2031: number;
        2032: number;
        2033: number;
        2034: number;
        2035: number;
    };
    getDailyPool(year: number): number;
    POINTS: {
        POST_CREATED: number;
        LIKE_RECEIVED: number;
        COMMENT_RECEIVED: number;
        VIEW_RECEIVED: number;
        LIKE_GIVEN: number;
        COMMENT_GIVEN: number;
    };
    calculatePoints(engagement: {
        postsCreated: number;
        likesReceived: number;
        commentsReceived: number;
        viewsReceived: number;
        likesGiven: number;
        commentsGiven: number;
    }): number;
    MINIMUM_POINTS_FOR_REWARD: number;
    MAX_POINTS_PER_DAY: number;
};
