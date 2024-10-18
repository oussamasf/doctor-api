import { Module } from '@nestjs/common';
import { DoctorProfileModule } from './profile/doctor.profile.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    DoctorProfileModule,

    RouterModule.register([
      {
        path: 'doctor/profile',
        module: DoctorProfileModule,
      },
    ]),
  ],
})
export class DoctorModule {}
