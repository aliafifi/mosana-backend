import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { DailyEngagement, DailyEngagementSchema } from './reward.schema';
import { Reward, RewardSchema } from './reward.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyEngagement.name, schema: DailyEngagementSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
    ScheduleModule.forRoot(), // Enables cron jobs
    ConfigModule,
    AuthModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService], // Other modules can track engagement
})
export class RewardsModule {}
