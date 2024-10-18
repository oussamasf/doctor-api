import { Module } from '@nestjs/common';
import { PatientRegistryServices } from './patient.service';
import { PatientRegistryController } from './patient.controller';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';

@Module({
  controllers: [PatientRegistryController],
  providers: [PatientRegistryServices],
  imports: [PatientProfileModule],
})
export class PatientRegistryModule {}
