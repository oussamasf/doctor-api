import { Module } from '@nestjs/common';
import { PatientProfileModule } from './profile/patient.profile.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    PatientProfileModule,

    RouterModule.register([
      {
        path: 'patient/account',
        module: PatientProfileModule,
      },
    ]),
  ],
})
export class PatientModule {}
