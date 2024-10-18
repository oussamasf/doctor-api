import { Test, TestingModule } from '@nestjs/testing';
import { DoctorAccountService } from './doctor.profile.service';

describe('DoctorAccountService', () => {
  let service: DoctorAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorAccountService],
    }).compile();

    service = module.get<DoctorAccountService>(DoctorAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
