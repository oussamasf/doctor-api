import { Module } from '@nestjs/common';
import { PatientProfileModule } from './profile/patient.profile.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentForPatientModule } from './appointment/appointment.module';
import { PrescriptionForPatientModule } from './prescriptions/prescription.module';
import { MedicalHistoryForPatientModule } from './medical-histories/medical-history.module';

@Module({
  imports: [
    PatientProfileModule,
    AppointmentForPatientModule,
    PrescriptionForPatientModule,
    MedicalHistoryForPatientModule,

    RouterModule.register([
      {
        path: 'patient/account',
        module: PatientProfileModule,
      },
      {
        path: 'patient/appointment',
        module: AppointmentForPatientModule,
      },
      {
        path: 'patient/prescription',
        module: PrescriptionForPatientModule,
      },
      {
        path: 'patient/medical-history',
        module: MedicalHistoryForPatientModule,
      },
    ]),
  ],
})
export class PatientModule {}
