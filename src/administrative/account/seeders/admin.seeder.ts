// src/database/seeders/users.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import {
  Staff,
  StaffDocument,
} from 'src/administrative/account/schemas/administrative.schema';
import { ADMINISTRATIVE_ROLES } from 'src/administrative/account/constants/roles';

@Injectable()
export class AdminsSeeder {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async seed() {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const adminExists = await this.staffModel
      .findOne({
        email: adminEmail,
      })
      .exec();

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD,
        10,
      );

      const adminUser = new this.staffModel({
        email: adminEmail,
        password: hashedPassword,
        username: 'superadmin',
        roles: [ADMINISTRATIVE_ROLES.SUPER_ADMIN],
      });

      await adminUser.save();
      console.log('Admin user seeded');
    } else {
      console.log('Admin user already exists');
    }
  }
}
