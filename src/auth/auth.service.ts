import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { User, UserDocument } from '../users/user.schema';
import { WalletLoginDto } from './dto/wallet-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async walletLogin(walletLoginDto: WalletLoginDto) {
    const { walletAddress, signature, message } = walletLoginDto;

    // Step 1: Verify the signature
    const isValid = await this.verifySignature(
      walletAddress,
      signature,
      message,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Step 2: Find or create user
    let user = await this.userModel.findOne({ walletAddress });

    if (!user) {
      // First time login - create new user
      user = await this.userModel.create({
        walletAddress,
        lastLogin: new Date(),
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Step 3: Generate JWT token
    const payload: JwtPayload = {
      walletAddress: user.walletAddress,
      sub: user._id.toString(),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    };
  }

  private async verifySignature(
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      // Convert wallet address to PublicKey
      const publicKey = new PublicKey(walletAddress);

      // Decode signature from base58
      const signatureBytes = bs58.decode(signature);

      // Convert message to bytes
      const messageBytes = new TextEncoder().encode(message);

      // Verify signature using ed25519
      const verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKey.toBytes(),
      );

      return verified;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }
}
