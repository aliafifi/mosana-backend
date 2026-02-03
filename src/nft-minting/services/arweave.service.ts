import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Irys from '@irys/sdk';
import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

@Injectable()
export class ArweaveService {
  private readonly logger = new Logger(ArweaveService.name);
  private irysClient: Irys;

  constructor(private configService: ConfigService) {}

  /**
   * Initialize Irys client for uploading to Arweave
   * This is called once when the service starts
   */
  async initializeIrys(): Promise<void> {
    try {
      // Get the platform wallet's private key from environment variables
      const privateKeyString = this.configService.get<string>('PLATFORM_WALLET_PRIVATE_KEY');
      
      if (!privateKeyString) {
        this.logger.warn('Platform wallet private key not configured. Arweave uploads will fail.');
        return;
      }

      // Decode the base58 private key to bytes
      const privateKeyBytes = bs58.decode(privateKeyString);
      const keypair = Keypair.fromSecretKey(privateKeyBytes);

      // Get Solana RPC URL from environment
      const solanaRpcUrl = this.configService.get<string>('SOLANA_RPC_URL') || 'https://api.mainnet-beta.solana.com';

      // Initialize Irys client
      // We're using Solana to pay for Arweave storage
      this.irysClient = new Irys({
        network: 'mainnet', // or 'devnet' for testing
        token: 'solana',
        key: privateKeyString,
        config: {
          providerUrl: solanaRpcUrl,
        },
      });

      this.logger.log('Irys client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Irys client', error);
      throw error;
    }
  }

  /**
   * Upload NFT metadata to Arweave
   * Returns the permanent URI where the data is stored
   */
  async uploadMetadata(metadata: any): Promise<string> {
    if (!this.irysClient) {
      await this.initializeIrys();
    }

    try {
      // Convert metadata to JSON string
      const data = JSON.stringify(metadata);

      // Upload to Arweave via Irys
      this.logger.log('Uploading metadata to Arweave...');
      const receipt = await this.irysClient.upload(data, {
        tags: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'App-Name', value: 'Mosana' },
        ],
      });

      // The permanent URI where the data is stored
      const uri = `https://arweave.net/${receipt.id}`;
      
      this.logger.log(`Metadata uploaded successfully: ${uri}`);
      return uri;
    } catch (error) {
      this.logger.error('Failed to upload metadata to Arweave', error);
      throw error;
    }
  }

  /**
   * Format post data into NFT metadata standard
   * This follows the Metaplex Token Metadata Standard
   */
  formatPostMetadata(post: any): any {
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

  /**
   * Calculate the cost to upload data to Arweave
   * Returns cost in SOL
   */
  async getUploadCost(dataSize: number): Promise<number> {
    if (!this.irysClient) {
      await this.initializeIrys();
    }

    try {
      // Get price in atomic units (lamports for Solana)
      const price = await this.irysClient.getPrice(dataSize);
      
      // Convert to SOL (1 SOL = 1,000,000,000 lamports)
      const priceInSol = Number(price) / 1_000_000_000;
      
      return priceInSol;
    } catch (error) {
      this.logger.error('Failed to get upload cost', error);
      throw error;
    }
  }

  /**
   * Check if Irys client is initialized and funded
   */
  async checkBalance(): Promise<number> {
    if (!this.irysClient) {
      await this.initializeIrys();
    }

    try {
      const balance = await this.irysClient.getLoadedBalance();
      const balanceInSol = Number(balance) / 1_000_000_000;
      
      this.logger.log(`Irys balance: ${balanceInSol} SOL`);
      return balanceInSol;
    } catch (error) {
      this.logger.error('Failed to check Irys balance', error);
      throw error;
    }
  }
}
