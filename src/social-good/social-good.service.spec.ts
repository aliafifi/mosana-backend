import { Test, TestingModule } from '@nestjs/testing';
import { SocialGoodService } from './social-good.service';

describe('SocialGoodService', () => {
  let service: SocialGoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialGoodService],
    }).compile();

    service = module.get<SocialGoodService>(SocialGoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
