import { Test, TestingModule } from '@nestjs/testing';
import { InformasiBuronanController } from './informasi-buronan.controller';

describe('InformasiBuronanController', () => {
  let controller: InformasiBuronanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformasiBuronanController],
    }).compile();

    controller = module.get<InformasiBuronanController>(
      InformasiBuronanController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
