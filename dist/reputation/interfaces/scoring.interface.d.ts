export interface ScoringConfig {
    accountAge: {
        maxPoints: number;
        daysForMaxScore: number;
    };
    engagement: {
        maxPoints: number;
        pointsPerPost: number;
        pointsPerLike: number;
        pointsPerComment: number;
        spamThreshold: number;
    };
    economic: {
        maxPoints: number;
        mosanaPerPoint: number;
        tipWeightRecent: number;
        tipWeightOld: number;
    };
    socialGood: {
        maxPoints: number;
        mosanaPerPoint: number;
        consistencyBonus: number;
        minimumForBonus: number;
    };
    dao: {
        maxPoints: number;
        pointsPerDao: number;
        pointsPerProposal: number;
        pointsPerVote: number;
        failedProposalPenalty: number;
    };
    nft: {
        maxPoints: number;
        pointsPerMint: number;
        pointsPerSale: number;
        revenuePerPoint: number;
    };
    trust: {
        maxPoints: number;
        highRepThreshold: number;
        weightMultiplier: number;
    };
}
export declare const DEFAULT_SCORING_CONFIG: ScoringConfig;
export declare const PENALTY_PRESETS: {
    spam_report: number;
    sybil_pattern: number;
    failed_proposal_majority: number;
    zero_charity_90days: number;
    rapid_account_creation: number;
    fake_engagement: number;
    admin_warning: number;
    admin_suspension: number;
};
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}
export declare const AVAILABLE_BADGES: Badge[];
