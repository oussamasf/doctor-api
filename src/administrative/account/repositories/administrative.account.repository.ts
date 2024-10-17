import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Staff, StaffDocument } from '../schemas/administrative.schema';

@Injectable()
export class StaffRepository {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  /**
   * Creates a new admin.
   * @param user The admin object to be created.
   * @returns A Promise resolving to the created admin.
   */
  async create(user: Staff): Promise<Staff> {
    const newUser = new this.staffModel(user);
    return newUser.save();
  }

  /**
   * Finds a single admin based on the provided filter query.
   * @param userFilterQuery The filter query to search for an admin.
   * @returns A Promise resolving to the found admin.
   */
  async findOne(userFilterQuery: FilterQuery<Staff>): Promise<Staff> {
    return this.staffModel.findOne(userFilterQuery);
  }

  /**
   * Finds admins based on the provided filter query.
   * @param usersFilterQuery The filter query to search for admins.
   * @returns A Promise resolving to an array of found admins.
   */
  async find(usersFilterQuery: FilterQuery<Staff>): Promise<Staff[]> {
    return this.staffModel.find(usersFilterQuery);
  }

  /**
   * Finds a single admin and updates it based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the admin to update.
   * @param updateQuery The update query to be applied.
   * @returns A Promise resolving to the updated admin.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Staff>,
    updateQuery: UpdateQuery<Staff>,
  ): Promise<Staff> {
    return this.staffModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }
}
