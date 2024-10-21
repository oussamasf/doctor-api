import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { DoctorProfileController } from './doctor.profile.controller';

// Services
import { DoctorProfileService } from './doctor.profile.service';

//
import { DoctorProfileRepository } from './repository/doctor.profile.repository';

// Schema
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    JwtModule.register({}),
  ],
  controllers: [DoctorProfileController],
  providers: [
    DoctorProfileService,
    DoctorProfileRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [DoctorProfileService, DoctorProfileRepository],
})
export class DoctorProfileModule {}
