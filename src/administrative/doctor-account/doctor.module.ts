import { Module } from '@nestjs/common';
import { DoctorRegistryServices } from './doctor.service';
import { DoctorRegistryController } from './doctor.controller';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';

@Module({
  controllers: [DoctorRegistryController],
  providers: [DoctorRegistryServices],
  imports: [DoctorProfileModule],
})
export class DoctorRegistryModule {}
