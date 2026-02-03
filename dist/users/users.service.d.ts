import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetNftPfpDto } from './dto/set-nft-pfp.dto';
export declare class UsersService {
    private userModel;
    private configService;
    private solanaConnection;
    constructor(userModel: Model<UserDocument>, configService: ConfigService);
    findByWallet(walletAddress: string): Promise<User>;
    updateProfile(walletAddress: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    setNftProfilePicture(walletAddress: string, setNftPfpDto: SetNftPfpDto): Promise<User>;
    followUser(followerWallet: string, followingWallet: string): Promise<{
        message: string;
    }>;
    unfollowUser(followerWallet: string, followingWallet: string): Promise<{
        message: string;
    }>;
    private verifyNftOwnership;
}
