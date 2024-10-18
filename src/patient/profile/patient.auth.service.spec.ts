import { Test, TestingModule } from '@nestjs/testing';
import { PatientAuthService } from './patient.auth.service';

describe('PatientAuthService', () => {
  let service: PatientAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientAuthService],
    }).compile();

    service = module.get<PatientAuthService>(PatientAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
