import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { SolanaVerificationService } from './services/solana-verification.service';
import { Verification, VerificationSchema } from './schemas/verification.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [VerificationController],
  providers: [VerificationService, SolanaVerificationService],
  exports: [VerificationService], // Export so reputation module can use it
})
export class VerificationModule {}
