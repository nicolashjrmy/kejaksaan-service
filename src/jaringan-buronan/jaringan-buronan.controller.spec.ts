import { Test, TestingModule } from '@nestjs/testing';
import { JaringanBuronanController } from './jaringan-buronan.controller';

describe('JaringanBuronanController', () => {
  let controller: JaringanBuronanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JaringanBuronanController],
    }).compile();

    controller = module.get<JaringanBuronanController>(JaringanBuronanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
