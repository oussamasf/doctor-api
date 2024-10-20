import { Module } from '@nestjs/common';
import { PatientRegistryServices } from './patient.account.service';
import { PatientRegistryController } from './patient.account.controller';

@Module({
  controllers: [PatientRegistryController],
  providers: [PatientRegistryServices],
})
export class PatientRegistryModule {}
