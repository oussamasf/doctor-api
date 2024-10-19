import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from 'src/doctor/appointment/appointment.service';
import { AppointmentModule } from 'src/doctor/appointment/appointment.module';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';

@Module({
  imports: [AppointmentModule, PatientProfileModule, DoctorProfileModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentForAdministrativeModule {}
