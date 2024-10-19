import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { PrescriptionController } from './prescription.controller';

// Services
import { PrescriptionService } from './prescription.service';

//
import { PrescriptionRepository } from './repository/prescription.repository';

// Schema
import {
  Prescription,
  PrescriptionSchema,
} from './schemas/prescription.schema';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';
import { DoctorProfileModule } from '../profile/doctor.profile.module';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    ConfigModule,
    PatientProfileModule,
    DoctorProfileModule,
    MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
    AppointmentModule,
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService, PrescriptionRepository],
  exports: [PrescriptionService, PrescriptionRepository],
})
export class PrescriptionModule {}
