import { Module } from '@nestjs/common';
import { PatientAuthModule } from './account/patient.auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    PatientAuthModule,

    RouterModule.register([
      {
        path: 'patient/account',
        module: PatientAuthModule,
      },
    ]),
  ],
})
export class PatientModule {}
