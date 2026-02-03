import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, generateSigner, percentAmount } from '@metaplex-foundation/umi';
import bs58 from 'bs58';
import { Nft, NftDocument } from './schemas/nft.schema';
import { ArweaveService } from './services/arweave.service';

@Injectable()
export class NftMintingService {
  private readonly logger = new Logger(NftMintingService.name);
  private connection: Connection;

  constructor(
    @InjectModel(Nft.name) private nftModel: Model<NftDocument>,
    private arweaveService: ArweaveService,
    private configService: ConfigService,
  ) {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL') || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  /**
   * Mint a post as NFT
   */
  async mintPost(postId: string, post: any, royaltyPercentage: number): Promise<NftDocument> {
    try {
      // Check if post is already minted
      const existingNft = await this.nftModel.findOne({ postId });
      if (existingNft) {
        throw new BadRequestException('This post has already been minted as an NFT');
      }

      // Validate royalty percentage
      if (royaltyPercentage < 0 || royaltyPercentage > 50) {
        throw new BadRequestException('Royalty percentage must be between 0 and 50');
      }

      this.logger.log(`Starting NFT mint for post ${postId}`);

      // Step 1: Format and upload metadata to Arweave
      const metadata = this.arweaveService.formatPostMetadata(post);
      const metadataUri = await this.arweaveService.uploadMetadata(metadata);
      this.logger.log(`Metadata uploaded: ${metadataUri}`);

      // Step 2: Mint NFT on Solana
      const mintAddress = await this.mintNftOnChain(
        metadata.name,
        metadataUri,
        post.author.walletAddress,
        royaltyPercentage,
      );
      this.logger.log(`NFT minted on-chain: ${mintAddress}`);

      // Step 3: Save to database
      const nft = new this.nftModel({
        postId,
        mintAddress,
        metadataUri,
        creator: post.author.walletAddress,
        owner: post.author.walletAddress,
        royaltyPercentage,
        engagementSnapshot: {
          likes: post.likes || 0,
          comments: post.commentsCount || 0,
          tips: 0, // Can be enhanced later
        },
      });

      await nft.save();
      this.logger.log(`NFT saved to database: ${nft._id}`);

      return nft;
    } catch (error) {
      this.logger.error(`Failed to mint NFT for post ${postId}`, error);
      throw error;
    }
  }

  /**
   * Mint NFT on Solana blockchain using Metaplex
   */
  private async mintNftOnChain(
    name: string,
    uri: string,
    creatorWallet: string,
    royaltyPercentage: number,
  ): Promise<string> {
    try {
      // Get platform wallet private key
      const privateKeyString = this.configService.get<string>('PLATFORM_WALLET_PRIVATE_KEY');
      if (!privateKeyString) {
        throw new Error('Platform wallet private key not configured');
      }

      // Create UMI instance (Metaplex's new framework)
      const umi = createUmi(this.connection.rpcEndpoint)
        .use(mplTokenMetadata());

      // Set up platform wallet as payer
      const privateKeyBytes = bs58.decode(privateKeyString);
      const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(privateKeyBytes));
      umi.use(keypairIdentity(keypair));

      // Generate new mint address
      const mint = generateSigner(umi);

      // Create the NFT
      await createNft(umi, {
        mint,
        name,
        uri,
        sellerFeeBasisPoints: percentAmount(royaltyPercentage), // Royalty as percentage
        creators: [
          {
            address: creatorWallet as any,
            share: 100,
            verified: false, // Creator needs to verify themselves
          },
        ],
      }).sendAndConfirm(umi);

      return mint.publicKey.toString();
    } catch (error) {
      this.logger.error('Failed to mint NFT on-chain', error);
      throw error;
    }
  }

  /**
   * Get NFT by mint address
   */
  async getNftByMintAddress(mintAddress: string): Promise<NftDocument> {
    const nft = await this.nftModel.findOne({ mintAddress }).populate('postId');
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
    return nft;
  }

  /**
   * Get all NFTs minted by a user
   */
  async getUserNfts(walletAddress: string): Promise<NftDocument[]> {
    return this.nftModel
      .find({ creator: walletAddress, isBurned: false })
      .populate('postId')
      .sort({ createdAt: -1 });
  }

  /**
   * Check if a post has been minted
   */
  async checkIfPostMinted(postId: string): Promise<{ minted: boolean; nft?: NftDocument }> {
    const nft = await this.nftModel.findOne({ postId });
    return {
      minted: !!nft,
      nft: nft || undefined,
    };
  }

  /**
   * Get platform minting statistics
   */
  async getMintingStats(): Promise<any> {
    const totalMinted = await this.nftModel.countDocuments({ isBurned: false });
    const totalBurned = await this.nftModel.countDocuments({ isBurned: true });
    
    const recentMints = await this.nftModel
      .find({ isBurned: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('postId');

    return {
      totalMinted,
      totalBurned,
      recentMints,
    };
  }
}
