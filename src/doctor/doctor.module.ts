import { Module } from '@nestjs/common';
import { DoctorAuthModule } from './account/Doctor.auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    DoctorAuthModule,

    RouterModule.register([
      {
        path: 'Doctor/account',
        module: DoctorAuthModule,
      },
    ]),
  ],
})
export class DoctorModule {}
