import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { PatientAuthController } from './patient.auth.controller';

// Services
import { PatientAuthService } from './patient.auth.service';

//
import { PatientAuthRepository } from './repository/patient.auth.repository';

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
    PatientAuthService,
    PatientAuthRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class PatientAuthModule {}
