import { Test, TestingModule } from '@nestjs/testing';
import { DoctorAuthController } from './Doctor.auth.controller';
import { DoctorAuthService } from './Doctor.auth.service';

describe('DoctorAuthController', () => {
  let controller: DoctorAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorAuthController],
      providers: [DoctorAuthService],
    }).compile();

    controller = module.get<DoctorAuthController>(DoctorAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
