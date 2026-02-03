import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { Export, ExportSchema } from './schemas/export.schema';
import { AuthModule } from '../auth/auth.module';

// Import all the schemas we need for data aggregation
import { User, UserSchema } from '../users/user.schema';
import { Post, PostSchema } from '../posts/post.schema';
import { Tip, TipSchema } from '../tipping/tip.schema';
import { Donation, DonationSchema } from '../social-good/schemas/donation.schema';
import { Nft, NftSchema } from '../nft-minting/schemas/nft.schema';
import { Dao, DaoSchema } from '../dao/schemas/dao.schema';
import { Proposal, ProposalSchema } from '../dao/schemas/proposal.schema';
import { Venture, VentureSchema } from '../ventures/schemas/venture.schema';
import { Reward, RewardSchema } from '../rewards/reward.schema';
import { Reputation, ReputationSchema } from '../reputation/schemas/reputation.schema';
import { Verification, VerificationSchema } from '../verification/schemas/verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Export.name, schema: ExportSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Tip.name, schema: TipSchema },
      { name: Donation.name, schema: DonationSchema },
      { name: Nft.name, schema: NftSchema },
      { name: Dao.name, schema: DaoSchema },
      { name: Proposal.name, schema: ProposalSchema },
      { name: Venture.name, schema: VentureSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: Reputation.name, schema: ReputationSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
    AuthModule,
  ],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
