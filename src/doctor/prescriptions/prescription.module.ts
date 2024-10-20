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

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService, PrescriptionRepository],
  exports: [PrescriptionService, PrescriptionRepository],
})
export class PrescriptionModule {}
