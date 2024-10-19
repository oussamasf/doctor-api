import { Module } from '@nestjs/common';
import { PatientRegistryServices } from './patient.account.service';
import { PatientRegistryController } from './patient.account.controller';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';

@Module({
  controllers: [PatientRegistryController],
  providers: [PatientRegistryServices],
  imports: [PatientProfileModule],
})
export class PatientRegistryModule {}
