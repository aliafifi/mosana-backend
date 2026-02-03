import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NftMintingService } from './nft-minting.service';
import { NftMintingController } from './nft-minting.controller';
import { Nft, NftSchema } from './schemas/nft.schema';
import { ArweaveService } from './services/arweave.service';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { Post, PostSchema } from '../posts/post.schema'; // Add this line

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nft.name, schema: NftSchema },
      { name: Post.name, schema: PostSchema }, // Add this line
    ]),
    PostsModule,
    UsersModule,
  ],
  providers: [
    NftMintingService,
    ArweaveService,
  ],
  controllers: [NftMintingController],
  exports: [NftMintingService],
})
export class NftMintingModule {}
