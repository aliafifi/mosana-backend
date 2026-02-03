import { DaoService } from './dao.service';
import { CreateDaoDto } from './dto/create-dao.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
export declare class DaoController {
    private readonly daoService;
    constructor(daoService: DaoService);
    createDao(createDaoDto: CreateDaoDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/dao.schema").DaoDocument;
    }>;
    getAllDaos(status?: string, sortBy?: string): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/dao.schema").DaoDocument[];
    }>;
    getDaoById(daoId: string): Promise<{
        success: boolean;
        data: import("./schemas/dao.schema").DaoDocument;
    }>;
    getMyDaos(req: any): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/dao.schema").DaoDocument[];
    }>;
    joinDao(daoId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/dao.schema").DaoDocument;
    }>;
    leaveDao(daoId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/dao.schema").DaoDocument;
    }>;
    createProposal(daoId: string, createProposalDto: CreateProposalDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/proposal.schema").ProposalDocument;
    }>;
    getDaoProposals(daoId: string, status?: string): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/proposal.schema").ProposalDocument[];
    }>;
    getProposalById(proposalId: string): Promise<{
        success: boolean;
        data: import("./schemas/proposal.schema").ProposalDocument;
    }>;
    castVote(proposalId: string, castVoteDto: CastVoteDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/proposal.schema").ProposalDocument;
    }>;
    getMyVote(proposalId: string, req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getDaoStats(daoId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getPlatformStats(): Promise<{
        success: boolean;
        data: any;
    }>;
}
