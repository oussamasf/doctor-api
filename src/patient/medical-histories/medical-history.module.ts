import { Module } from '@nestjs/common';

import { PatientProfileModule } from '../profile/patient.profile.module';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';
import { MedicalHistoryModule } from 'src/doctor/medical-histories/medical-history.module';
import { MedicalHistoryService } from 'src/doctor/medical-histories/medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { PrescriptionModule } from 'src/doctor/prescriptions/prescription.module';

@Module({
  imports: [
    MedicalHistoryModule,
    PatientProfileModule,
    DoctorProfileModule,
    PrescriptionModule,
  ],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryForPatientModule {}
