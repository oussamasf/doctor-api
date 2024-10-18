import { Test, TestingModule } from '@nestjs/testing';
import { PatientAuthController } from './patient.profile.controller';
import { PatientAuthService } from './patient.profile.service';

describe('PatientAuthController', () => {
  let controller: PatientAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientAuthController],
      providers: [PatientAuthService],
    }).compile();

    controller = module.get<PatientAuthController>(PatientAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
