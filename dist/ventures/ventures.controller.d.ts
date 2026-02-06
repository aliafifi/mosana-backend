import { VenturesService } from './ventures.service';
import { CreateVentureDto } from './dto/create-venture.dto';
export declare class VenturesController {
    private readonly venturesService;
    constructor(venturesService: VenturesService);
    createVenture(createVentureDto: CreateVentureDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/venture.schema").VentureDocument;
    }>;
    acceptVenture(ventureId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/venture.schema").VentureDocument;
    }>;
    rejectVenture(ventureId: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/venture.schema").VentureDocument;
    }>;
    getVentureByPost(postId: string): Promise<{
        success: boolean;
        message: string;
        data: null;
    } | {
        success: boolean;
        data: import("./schemas/venture.schema").VentureDocument;
        message?: undefined;
    }>;
    getMyVentures(req: any): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/venture.schema").VentureDocument[];
    }>;
    getPendingInvitations(req: any): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/venture.schema").VentureDocument[];
    }>;
    getVentureSplits(ventureId: string): Promise<{
        success: boolean;
        count: number;
        data: import("./schemas/revenue-split.schema").RevenueSplitDocument[];
    }>;
    getMyEarnings(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getUserVentureStats(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getVentureStats(): Promise<{
        success: boolean;
        data: any;
    }>;
}
