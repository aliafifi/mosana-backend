import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { WalletLoginDto } from './dto/wallet-login.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    walletLogin(walletLoginDto: WalletLoginDto): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            walletAddress: string;
            username: string;
            profileImage: string;
            bio: string;
        };
    }>;
    private verifySignature;
}
