import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DaoController } from './dao.controller';
import { DaoService } from './dao.service';
import { Dao, DaoSchema } from './schemas/dao.schema';
import { Proposal, ProposalSchema } from './schemas/proposal.schema';
import { ReputationModule } from '../reputation/reputation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dao.name, schema: DaoSchema },
      { name: Proposal.name, schema: ProposalSchema },
    ]),
    ReputationModule,
  ],
  controllers: [DaoController],
  providers: [DaoService],
  exports: [DaoService],
})
export class DaoModule {}
