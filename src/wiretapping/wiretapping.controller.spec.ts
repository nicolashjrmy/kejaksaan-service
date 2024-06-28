import { Test, TestingModule } from '@nestjs/testing';
import { WiretappingController } from './wiretapping.controller';

describe('WiretappingController', () => {
  let controller: WiretappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WiretappingController],
    }).compile();

    controller = module.get<WiretappingController>(WiretappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
