import { AuthService } from './auth.service';
import { WalletLoginDto } from './dto/wallet-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(walletLoginDto: WalletLoginDto): Promise<{
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            walletAddress: string;
            username: string;
            profileImage: string;
            bio: string;
        };
    }>;
}
