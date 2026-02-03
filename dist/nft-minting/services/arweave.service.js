"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ArweaveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArweaveService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@irys/sdk"));
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
let ArweaveService = ArweaveService_1 = class ArweaveService {
    configService;
    logger = new common_1.Logger(ArweaveService_1.name);
    irysClient;
    constructor(configService) {
        this.configService = configService;
    }
    async initializeIrys() {
        try {
            const privateKeyString = this.configService.get('PLATFORM_WALLET_PRIVATE_KEY');
            if (!privateKeyString) {
                this.logger.warn('Platform wallet private key not configured. Arweave uploads will fail.');
                return;
            }
            const privateKeyBytes = bs58_1.default.decode(privateKeyString);
            const keypair = web3_js_1.Keypair.fromSecretKey(privateKeyBytes);
            const solanaRpcUrl = this.configService.get('SOLANA_RPC_URL') || 'https://api.mainnet-beta.solana.com';
            this.irysClient = new sdk_1.default({
                network: 'mainnet',
                token: 'solana',
                key: privateKeyString,
                config: {
                    providerUrl: solanaRpcUrl,
                },
            });
            this.logger.log('Irys client initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Irys client', error);
            throw error;
        }
    }
    async uploadMetadata(metadata) {
        if (!this.irysClient) {
            await this.initializeIrys();
        }
        try {
            const data = JSON.stringify(metadata);
            this.logger.log('Uploading metadata to Arweave...');
            const receipt = await this.irysClient.upload(data, {
                tags: [
                    { name: 'Content-Type', value: 'application/json' },
                    { name: 'App-Name', value: 'Mosana' },
                ],
            });
            const uri = `https://arweave.net/${receipt.id}`;
            this.logger.log(`Metadata uploaded successfully: ${uri}`);
            return uri;
        }
        catch (error) {
            this.logger.error('Failed to upload metadata to Arweave', error);
            throw error;
        }
    }
    formatPostMetadata(post) {
        return {
            name: `Mosana Post #${post._id.toString().slice(-8)}`,
            description: post.content,
            image: post.imageUrl || 'https://mosana.xyz/default-nft-image.png',
            external_url: `https://mosana.xyz/post/${post._id}`,
            attributes: [
                {
                    trait_type: 'Author',
                    value: post.author.username || post.author.walletAddress.slice(0, 8),
                },
                {
                    trait_type: 'Likes',
                    value: post.likes || 0,
                },
                {
                    trait_type: 'Comments',
                    value: post.commentsCount || 0,
                },
                {
                    trait_type: 'Created At',
                    value: new Date(post.createdAt).toISOString().split('T')[0],
                },
                {
                    trait_type: 'Platform',
                    value: 'Mosana',
                },
            ],
            properties: {
                category: post.imageUrl ? 'image' : 'text',
                creators: [
                    {
                        address: post.author.walletAddress,
                        share: 100,
                    },
                ],
            },
        };
    }
    async getUploadCost(dataSize) {
        if (!this.irysClient) {
            await this.initializeIrys();
        }
        try {
            const price = await this.irysClient.getPrice(dataSize);
            const priceInSol = Number(price) / 1_000_000_000;
            return priceInSol;
        }
        catch (error) {
            this.logger.error('Failed to get upload cost', error);
            throw error;
        }
    }
    async checkBalance() {
        if (!this.irysClient) {
            await this.initializeIrys();
        }
        try {
            const balance = await this.irysClient.getLoadedBalance();
            const balanceInSol = Number(balance) / 1_000_000_000;
            this.logger.log(`Irys balance: ${balanceInSol} SOL`);
            return balanceInSol;
        }
        catch (error) {
            this.logger.error('Failed to check Irys balance', error);
            throw error;
        }
    }
};
exports.ArweaveService = ArweaveService;
exports.ArweaveService = ArweaveService = ArweaveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ArweaveService);
//# sourceMappingURL=arweave.service.js.map