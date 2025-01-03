import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { MedicalHistoryController } from './medical-history.controller';

// Services
import { MedicalHistoryService } from './medical-history.service';

//
import { MedicalHistoryRepository } from './repository/medical-history.repository';

// Schema
import {
  MedicalHistory,
  MedicalHistorySchema,
} from './schemas/medical-history.schema';

import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      { name: MedicalHistory.name, schema: MedicalHistorySchema },
    ]),
    AppointmentModule,
  ],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService, MedicalHistoryRepository],
  exports: [MedicalHistoryService, MedicalHistoryRepository],
})
export class MedicalHistoryModule {}
