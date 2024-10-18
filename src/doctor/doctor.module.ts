import { Module } from '@nestjs/common';
import { DoctorProfileModule } from './profile/doctor.profile.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    DoctorProfileModule,
    AppointmentModule,

    RouterModule.register([
      {
        path: 'doctor/account',
        module: DoctorProfileModule,
      },
      {
        path: 'doctor/appointment',
        module: AppointmentModule,
      },
    ]),
  ],
})
export class DoctorModule {}
