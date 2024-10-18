import { Module } from '@nestjs/common';
import { AdministrativeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';
import { DoctorRegistryModule } from './doctor-account/doctor.module';

@Module({
  imports: [
    AdministrativeAuthModule,
    DoctorRegistryModule,

    RouterModule.register([
      {
        path: 'administrative/account',
        module: AdministrativeAuthModule,
      },
      {
        path: 'administrative/doctor',
        module: DoctorRegistryModule,
      },
    ]),
  ],
})
export class AdministrativeModule {}
