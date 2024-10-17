import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { administrativeAuthController } from './administrative.auth.controller';

// Service
import { AdministrativeService } from './administrative.service';
import { StaffRepository } from './repositories/administrative.account.repository';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies/';

// Schema
import { Staff, StaffSchema } from './schemas/administrative.schema';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
    JwtModule.register({}),
  ],
  controllers: [administrativeAuthController],
  providers: [
    AdministrativeService,
    StaffRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AdministrativeAuthModule {}
