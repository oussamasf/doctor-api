import { Test, TestingModule } from '@nestjs/testing';
import { PatientAuthController } from './patient.auth.controller';
import { PatientAuthService } from './patient.auth.service';

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
