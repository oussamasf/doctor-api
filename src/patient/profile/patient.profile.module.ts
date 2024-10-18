import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { PatientAuthController } from './patient.profile.controller';

// Services
import { PatientProfileService } from './patient.profile.service';

//
import { PatientAuthRepository } from './repository/patient.profile.repository';

// Schema
import { Patient, PatientSchema } from './schemas/patient.schema';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    JwtModule.register({}),
  ],
  controllers: [PatientAuthController],
  providers: [
    PatientProfileService,
    PatientAuthRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [PatientProfileService],
})
export class PatientProfileModule {}
