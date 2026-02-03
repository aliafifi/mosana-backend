import { Test, TestingModule } from '@nestjs/testing';
import { NftMintingController } from './nft-minting.controller';

describe('NftMintingController', () => {
  let controller: NftMintingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftMintingController],
    }).compile();

    controller = module.get<NftMintingController>(NftMintingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
