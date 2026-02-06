import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { RewardsModule } from './rewards/rewards.module';
import { TippingModule } from './tipping/tipping.module';
import { NftMintingModule } from './nft-minting/nft-minting.module';
import { VenturesModule } from './ventures/ventures.module';
import { SocialGoodModule } from './social-good/social-good.module';
import { DaoModule } from './dao/dao.module';
import { ReputationModule } from './reputation/reputation.module';
import { VerificationModule } from './verification/verification.module';
import { ExportModule } from './export/export.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Connect to MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/mosana'),

    // Rate limiting (security)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    PostsModule,
    RewardsModule,
    TippingModule,
    NftMintingModule,
    VenturesModule,
    SocialGoodModule,
    DaoModule,
    ReputationModule,
    VerificationModule,
    ExportModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
