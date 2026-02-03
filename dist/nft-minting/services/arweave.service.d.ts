import { ConfigService } from '@nestjs/config';
export declare class ArweaveService {
    private configService;
    private readonly logger;
    private irysClient;
    constructor(configService: ConfigService);
    initializeIrys(): Promise<void>;
    uploadMetadata(metadata: any): Promise<string>;
    formatPostMetadata(post: any): any;
    getUploadCost(dataSize: number): Promise<number>;
    checkBalance(): Promise<number>;
}
