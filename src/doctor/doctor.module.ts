import { Module } from '@nestjs/common';
import { DoctorProfileModule } from './profile/doctor.profile.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentModule } from './appointment/appointment.module';
import { PatientForDoctorModule } from './patient-account/patient.module';
import { PrescriptionModule } from './prescriptions/prescription.module';

@Module({
  imports: [
    DoctorProfileModule,
    AppointmentModule,
    PatientForDoctorModule,
    PrescriptionModule,

    RouterModule.register([
      {
        path: 'doctor/account',
        module: DoctorProfileModule,
      },
      {
        path: 'doctor/appointment',
        module: AppointmentModule,
      },
      {
        path: 'doctor/patient',
        module: PatientForDoctorModule,
      },
      {
        path: 'doctor/prescription',
        module: PrescriptionModule,
      },
    ]),
  ],
})
export class DoctorModule {}
