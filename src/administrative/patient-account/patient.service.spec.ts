import { Test, TestingModule } from '@nestjs/testing';
import { PatientRegistryServices } from './patient.service';

describe('PatientService', () => {
  let service: PatientRegistryServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientRegistryServices],
    }).compile();

    service = module.get<PatientRegistryServices>(PatientRegistryServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
