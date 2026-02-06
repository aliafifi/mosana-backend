import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetNftPfpDto } from './dto/set-nft-pfp.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class UsersService {
    private userModel;
    private configService;
    private notificationsService;
    private solanaConnection;
    constructor(userModel: Model<UserDocument>, configService: ConfigService, notificationsService: NotificationsService);
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
    registerFcmToken(walletAddress: string, fcmToken: string): Promise<{
        message: string;
    }>;
    unregisterFcmToken(walletAddress: string, fcmToken: string): Promise<{
        message: string;
    }>;
    getFcmTokens(walletAddress: string): Promise<string[]>;
}
