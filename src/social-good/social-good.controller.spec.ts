import { Test, TestingModule } from '@nestjs/testing';
import { SocialGoodController } from './social-good.controller';

describe('SocialGoodController', () => {
  let controller: SocialGoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialGoodController],
    }).compile();

    controller = module.get<SocialGoodController>(SocialGoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
