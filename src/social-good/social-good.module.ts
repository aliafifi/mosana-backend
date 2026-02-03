import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialGoodService } from './social-good.service';
import { SocialGoodController } from './social-good.controller';
import { Cause, CauseSchema } from './schemas/cause.schema';
import { Donation, DonationSchema } from './schemas/donation.schema';
import { ReputationModule } from '../reputation/reputation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cause.name, schema: CauseSchema },
      { name: Donation.name, schema: DonationSchema },
    ]),
    ReputationModule,
  ],
  controllers: [SocialGoodController],
  providers: [SocialGoodService],
  exports: [SocialGoodService], // Other modules can use this
})
export class SocialGoodModule {}
