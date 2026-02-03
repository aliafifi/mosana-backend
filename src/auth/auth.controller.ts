import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WalletLoginDto } from './dto/wallet-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() walletLoginDto: WalletLoginDto) {
    return this.authService.walletLogin(walletLoginDto);
  }
}
