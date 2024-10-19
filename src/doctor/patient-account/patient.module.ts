import { Module } from '@nestjs/common';
import { PatientRegistryController } from './patient.controller';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';

@Module({
  controllers: [PatientRegistryController],
  providers: [PatientProfileModule],
  imports: [PatientProfileModule],
})
export class PatientForDoctorModule {}
