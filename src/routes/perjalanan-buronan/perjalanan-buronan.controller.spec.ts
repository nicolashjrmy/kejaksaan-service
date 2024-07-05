import { Test, TestingModule } from '@nestjs/testing';
import { PerjalananBuronanController } from './perjalanan-buronan.controller';

describe('PerjalananBuronanController', () => {
  let controller: PerjalananBuronanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerjalananBuronanController],
    }).compile();

    controller = module.get<PerjalananBuronanController>(PerjalananBuronanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
