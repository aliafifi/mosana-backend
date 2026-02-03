import { Test, TestingModule } from '@nestjs/testing';
import { VenturesController } from './ventures.controller';

describe('VenturesController', () => {
  let controller: VenturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenturesController],
    }).compile();

    controller = module.get<VenturesController>(VenturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
