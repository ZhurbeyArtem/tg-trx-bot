import { Test, TestingModule } from '@nestjs/testing';
import { TronscanService } from './tronscan.service';

describe('TronscanService', () => {
  let service: TronscanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TronscanService],
    }).compile();

    service = module.get<TronscanService>(TronscanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
