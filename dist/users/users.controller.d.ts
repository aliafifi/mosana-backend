import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SetNftPfpDto } from './dto/set-nft-pfp.dto';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: any): Promise<import("./user.schema").User>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./user.schema").User>;
    setNftProfilePicture(req: any, setNftPfpDto: SetNftPfpDto): Promise<import("./user.schema").User>;
    followUser(req: any, walletAddress: string): Promise<{
        message: string;
    }>;
    unfollowUser(req: any, walletAddress: string): Promise<{
        message: string;
    }>;
    registerFcmToken(req: any, registerFcmTokenDto: RegisterFcmTokenDto): Promise<{
        message: string;
    }>;
    unregisterFcmToken(req: any, registerFcmTokenDto: RegisterFcmTokenDto): Promise<{
        message: string;
    }>;
    getUserProfile(walletAddress: string): Promise<import("./user.schema").User>;
}
