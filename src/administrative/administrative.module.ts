import { Module } from '@nestjs/common';
import { AdministrativeAuthModule } from './account/auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    AdministrativeAuthModule,

    RouterModule.register([
      {
        path: 'administrative/account',
        module: AdministrativeAuthModule,
      },
    ]),
  ],
})
export class AdministrativeModule {}
