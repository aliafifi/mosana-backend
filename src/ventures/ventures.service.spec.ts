import { Test, TestingModule } from '@nestjs/testing';
import { VenturesService } from './ventures.service';

describe('VenturesService', () => {
  let service: VenturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenturesService],
    }).compile();

    service = module.get<VenturesService>(VenturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
