import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

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
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository],
})
export class AppointmentModule {}
