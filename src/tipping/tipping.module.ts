import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TippingController } from './tipping.controller';
import { TippingService } from './tipping.service';
import { Tip, TipSchema } from './tip.schema';
import { AuthModule } from '../auth/auth.module';
import { ReputationModule } from '../reputation/reputation.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tip.name, schema: TipSchema }]),
    ConfigModule,
    AuthModule,
    ReputationModule,
    NotificationsModule,
  ],
  controllers: [TippingController],
  providers: [TippingService],
  exports: [TippingService], // Other modules can access tipping data
})
export class TippingModule {}


