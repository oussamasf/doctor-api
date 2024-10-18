import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { DoctorAuthController } from './doctor.auth.controller';

// Services
import { DoctorAuthService } from './doctor.auth.service';

//
import { DoctorAuthRepository } from './repository/doctor.auth.repository';

// Schema
import { Doctor, DoctorSchema } from './schemas/Doctor.schema';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    JwtModule.register({}),
  ],
  controllers: [DoctorAuthController],
  providers: [
    DoctorAuthService,
    DoctorAuthRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class DoctorAuthModule {}
