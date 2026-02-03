import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VenturesService } from './ventures.service';
import { VenturesController } from './ventures.controller';
import { Venture, VentureSchema } from './schemas/venture.schema';
import { RevenueSplit, RevenueSplitSchema } from './schemas/revenue-split.schema';
import { ReputationModule } from '../reputation/reputation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Venture.name, schema: VentureSchema },
      { name: RevenueSplit.name, schema: RevenueSplitSchema },
    ]),
    ReputationModule,
  ],
  controllers: [VenturesController],
  providers: [VenturesService],
  exports: [VenturesService], // Export so other modules can use it
})
export class VenturesModule {}
