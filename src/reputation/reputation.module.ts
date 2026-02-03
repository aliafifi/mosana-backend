import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReputationService } from './reputation.service';
import { ReputationController } from './reputation.controller';
import { Reputation, ReputationSchema } from './schemas/reputation.schema';

@Module({
  imports: [
    // Register the Reputation schema with MongoDB
    MongooseModule.forFeature([
      { name: Reputation.name, schema: ReputationSchema },
    ]),
  ],
  controllers: [ReputationController],
  providers: [ReputationService],
  exports: [ReputationService], // Allow other modules to use ReputationService
})
export class ReputationModule {}
