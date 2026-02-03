import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection, PublicKey } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetNftPfpDto } from './dto/set-nft-pfp.dto';

@Injectable()
export class UsersService {
  private solanaConnection: Connection;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    // Initialize Solana connection
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL');
    this.solanaConnection = new Connection(rpcUrl || 'https://api.devnet.solana.com');
  }

  // Get user profile by wallet address
  async findByWallet(walletAddress: string): Promise<User> {
    const user = await this.userModel.findOne({ walletAddress }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Update user profile (secure - user can only update their own)
  async updateProfile(
    walletAddress: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    // Check if username is taken (if user is changing it)
    if (updateProfileDto.username) {
      const existingUser = await this.userModel.findOne({
        username: updateProfileDto.username,
        walletAddress: { $ne: walletAddress }, // Exclude current user
      });

      if (existingUser) {
        throw new ConflictException('Username already taken');
      }
    }

    // Update user
    const user = await this.userModel.findOneAndUpdate(
      { walletAddress },
      { $set: updateProfileDto },
      { new: true }, // Return updated document
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Set NFT as profile picture (with blockchain verification)
  async setNftProfilePicture(
    walletAddress: string,
    setNftPfpDto: SetNftPfpDto,
  ): Promise<User> {
    const { nftMintAddress } = setNftPfpDto;

    // SECURITY: Verify user owns this NFT on-chain
    const ownsNft = await this.verifyNftOwnership(walletAddress, nftMintAddress);

    if (!ownsNft) {
      throw new BadRequestException('You do not own this NFT');
    }

    // Update user's NFT profile picture
    const user = await this.userModel.findOneAndUpdate(
      { walletAddress },
      { $set: { nftProfilePicture: nftMintAddress } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Follow another user
  async followUser(
    followerWallet: string,
    followingWallet: string,
  ): Promise<{ message: string }> {
    // SECURITY: Cannot follow yourself
    if (followerWallet === followingWallet) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Check if target user exists
    const targetUser = await this.userModel.findOne({ walletAddress: followingWallet });
    if (!targetUser) {
      throw new NotFoundException('User to follow not found');
    }

    // Check if already following
    const currentUser = await this.userModel.findOne({ walletAddress: followerWallet });
  
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    if (currentUser.following.includes(followingWallet)) {
      throw new ConflictException('Already following this user');
    }

    // Add to following list
    await this.userModel.findOneAndUpdate(
      { walletAddress: followerWallet },
      { 
        $push: { following: followingWallet },
        $inc: { followingCount: 1 },
      },
    );

    // Increment target user's followers count
    await this.userModel.findOneAndUpdate(
      { walletAddress: followingWallet },
      { $inc: { followersCount: 1 } },
    );

    return { message: 'Successfully followed user' };
  }

  // Unfollow a user
  async unfollowUser(
    followerWallet: string,
    followingWallet: string,
  ): Promise<{ message: string }> {
    // Remove from following list
    await this.userModel.findOneAndUpdate(
      { walletAddress: followerWallet },
      { 
        $pull: { following: followingWallet },
        $inc: { followingCount: -1 },
      },
    );

    // Decrement target user's followers count
    await this.userModel.findOneAndUpdate(
      { walletAddress: followingWallet },
      { $inc: { followersCount: -1 } },
    );

    return { message: 'Successfully unfollowed user' };
  }

  // SECURITY: Verify NFT ownership on Solana blockchain
  private async verifyNftOwnership(
    walletAddress: string,
    nftMintAddress: string,
  ): Promise<boolean> {
    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const mintPublicKey = new PublicKey(nftMintAddress);

      // Get token accounts owned by this wallet
      const tokenAccounts = await this.solanaConnection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }, // SPL Token Program
      );

      // Check if wallet owns any tokens with this mint address
      const ownsToken = tokenAccounts.value.some(
        (accountInfo) => {
          const mint = accountInfo.account.data.parsed.info.mint;
          const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
          return mint === nftMintAddress && amount > 0;
        },
      );

      return ownsToken;
    } catch (error) {
      console.error('NFT ownership verification error:', error);
      return false;
    }
  }
}
