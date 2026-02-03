export declare class CreateDaoDto {
    name: string;
    description: string;
    logoUrl?: string;
    minTokensRequired?: number;
    votingPeriodDays?: number;
    quorumPercentage?: number;
    allowProposalsFrom?: string;
    minTokensToPropose?: number;
    tags?: string[];
}
