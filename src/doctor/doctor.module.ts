import { Module } from '@nestjs/common';
import { DoctorProfileModule } from './profile/doctor.profile.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentModule } from './appointment/appointment.module';
import { PatientForDoctorModule } from './patient-account/patient.module';

@Module({
  imports: [
    DoctorProfileModule,
    AppointmentModule,
    PatientForDoctorModule,

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
    ]),
  ],
})
export class DoctorModule {}
