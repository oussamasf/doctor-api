import { Test, TestingModule } from '@nestjs/testing';
import { PatientRegistryController } from './patient.controller';
import { PatientRegistryServices } from './patient.service';

describe('PatientController', () => {
  let controller: PatientRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientRegistryController],
      providers: [PatientRegistryServices],
    }).compile();

    controller = module.get<PatientRegistryController>(
      PatientRegistryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
