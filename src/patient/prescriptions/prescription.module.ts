import { Module } from '@nestjs/common';
import { PrescriptionController } from './prescription.controller';

import { PatientProfileModule } from '../profile/patient.profile.module';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';
import { PrescriptionModule } from 'src/doctor/prescriptions/prescription.module';
import { PrescriptionService } from 'src/doctor/prescriptions/prescription.service';
import { AppointmentModule } from 'src/doctor/appointment/appointment.module';

@Module({
  imports: [
    PrescriptionModule,
    PatientProfileModule,
    DoctorProfileModule,
    AppointmentModule,
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
})
export class PrescriptionForPatientModule {}
