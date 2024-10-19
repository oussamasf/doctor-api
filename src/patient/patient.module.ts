import { Module } from '@nestjs/common';
import { PatientProfileModule } from './profile/patient.profile.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentForPatientModule } from './appointment/appointment.module';

@Module({
  imports: [
    PatientProfileModule,
    AppointmentForPatientModule,

    RouterModule.register([
      {
        path: 'patient/account',
        module: PatientProfileModule,
      },
      {
        path: 'patient/appointment',
        module: AppointmentForPatientModule,
      },
    ]),
  ],
})
export class PatientModule {}
