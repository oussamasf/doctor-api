import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from 'src/doctor/appointment/appointment.service';
import { AppointmentModule } from 'src/doctor/appointment/appointment.module';
import { PatientProfileModule } from '../profile/patient.profile.module';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';

@Module({
  imports: [AppointmentModule, PatientProfileModule, DoctorProfileModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentForPatientModule {}
