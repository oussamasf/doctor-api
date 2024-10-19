import { Module } from '@nestjs/common';
import { AdministrativeAuthModule } from './account/administrative.account.module';
import { RouterModule } from '@nestjs/core';
import { DoctorRegistryModule } from './doctor-account/doctor.account.module';
import { PatientRegistryModule } from './patient-account/patient.account.module';

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
