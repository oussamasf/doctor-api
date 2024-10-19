import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controller
import { administrativeAuthController } from './administrative.account.controller';

// Service
import { AdministrativeService } from './administrative.account.service';
import { StaffRepository } from './repositories/administrative.account.repository';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

// Schema
import { Staff, StaffSchema } from './schemas/administrative.schema';
import { AdminsSeeder } from './seeders/admin.seeder';

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
    AdminsSeeder,
  ],
})
export class AdministrativeAuthModule implements OnModuleInit {
  constructor(private adminsSeeder: AdminsSeeder) {}

  onModuleInit() {
    this.adminsSeeder.seed();
  }
}
