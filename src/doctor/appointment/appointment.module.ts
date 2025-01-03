import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { AppointmentController } from './appointment.controller';

// Services
import { AppointmentService } from './appointment.service';

//
import { AppointmentRepository } from './repository/appointment.repository';

// Schema
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository],
  exports: [AppointmentService, AppointmentRepository],
})
export class AppointmentModule {}
