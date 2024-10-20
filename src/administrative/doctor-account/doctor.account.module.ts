import { Module } from '@nestjs/common';
import { DoctorRegistryServices } from './doctor.account.service';
import { DoctorRegistryController } from './doctor.account.controller';

@Module({
  controllers: [DoctorRegistryController],
  providers: [DoctorRegistryServices],
})
export class DoctorRegistryModule {}
