import { Module } from '@nestjs/common';
import { DoctorRegistryServices } from './doctor.account.service';
import { DoctorRegistryController } from './doctor.account.controller';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';

@Module({
  controllers: [DoctorRegistryController],
  providers: [DoctorRegistryServices],
  imports: [DoctorProfileModule],
})
export class DoctorRegistryModule {}
