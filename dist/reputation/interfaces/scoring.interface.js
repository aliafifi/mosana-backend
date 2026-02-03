"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABLE_BADGES = exports.PENALTY_PRESETS = exports.DEFAULT_SCORING_CONFIG = void 0;
exports.DEFAULT_SCORING_CONFIG = {
    accountAge: {
        maxPoints: 100,
        daysForMaxScore: 365,
    },
    engagement: {
        maxPoints: 250,
        pointsPerPost: 5,
        pointsPerLike: 0.5,
        pointsPerComment: 2,
        spamThreshold: 50,
    },
    economic: {
        maxPoints: 200,
        mosanaPerPoint: 100,
        tipWeightRecent: 1.5,
        tipWeightOld: 0.5,
    },
    socialGood: {
        maxPoints: 150,
        mosanaPerPoint: 50,
        consistencyBonus: 20,
        minimumForBonus: 5,
    },
    dao: {
        maxPoints: 100,
        pointsPerDao: 10,
        pointsPerProposal: 15,
        pointsPerVote: 2,
        failedProposalPenalty: -10,
    },
    nft: {
        maxPoints: 100,
        pointsPerMint: 20,
        pointsPerSale: 10,
        revenuePerPoint: 0.1,
    },
    trust: {
        maxPoints: 100,
        highRepThreshold: 500,
        weightMultiplier: 2.0,
    },
};
exports.PENALTY_PRESETS = {
    spam_report: -50,
    sybil_pattern: -100,
    failed_proposal_majority: -10,
    zero_charity_90days: -20,
    rapid_account_creation: -100,
    fake_engagement: -75,
    admin_warning: -25,
    admin_suspension: -200,
};
exports.AVAILABLE_BADGES = [
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
//# sourceMappingURL=scoring.interface.js.map