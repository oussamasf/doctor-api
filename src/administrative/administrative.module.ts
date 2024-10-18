import { Module } from '@nestjs/common';
import { AdministrativeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';
import { DoctorRegistryModule } from './doctor-account/doctor.module';
import { PatientRegistryModule } from './patient-account/patient.module';

@Module({
  imports: [
    AdministrativeAuthModule,
    DoctorRegistryModule,
    PatientRegistryModule,

    RouterModule.register([
      {
        path: 'administrative/account',
        module: AdministrativeAuthModule,
      },
      {
        path: 'administrative/doctor',
        module: DoctorRegistryModule,
      },
      {
        path: 'administrative/patient',
        module: PatientRegistryModule,
      },
    ]),
  ],
})
export class AdministrativeModule {}
