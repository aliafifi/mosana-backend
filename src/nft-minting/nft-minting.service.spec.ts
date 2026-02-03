import { Test, TestingModule } from '@nestjs/testing';
import { NftMintingService } from './nft-minting.service';

describe('NftMintingService', () => {
  let service: NftMintingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftMintingService],
    }).compile();

    service = module.get<NftMintingService>(NftMintingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
