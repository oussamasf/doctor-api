import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Doctor, DoctorDocument } from '../schemas/doctor.schema';

/**
 * Repository handling operations related to doctor authentication.
 */
@Injectable()
export class DoctorAuthRepository {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  /**
   * Finds a Doctor based on the provided filter query.
   * @param userFilterQuery The filter query to search for a Doctor.
   * @returns A promise that resolves to the found Doctor.
   */
  async findOne(userFilterQuery: FilterQuery<Doctor>): Promise<Doctor> {
    return this.doctorModel.findOne(userFilterQuery);
  }

  /**
   * Finds Doctors based on the provided filter query.
   * @param usersFilterQuery The filter query to search for Doctors.
   * @returns A promise that resolves to an array of Doctors.
   */
  async find(usersFilterQuery: FilterQuery<Doctor>): Promise<Doctor[]> {
    return this.doctorModel.find(usersFilterQuery);
  }

  /**
   * Creates a new Doctor.
   * @param user The Doctor data to create.
   * @returns A promise that resolves to the created Doctor.
   */
  async create(user): Promise<Doctor> {
    const newUser = new this.doctorModel(user);
    return newUser.save();
  }

  /**
   * Finds and updates a Doctor based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the Doctor.
   * @param updateQuery The update query to apply to the Doctor.
   * @returns A promise that resolves to the updated Doctor.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Doctor>,
    updateQuery: UpdateQuery<Doctor>,
  ): Promise<Doctor> {
    return this.doctorModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  /**
   * Finds a doctor by email and updates it based on the provided update query.
   * @param email The email of the doctor to find.
   * @param updateQuery The update query to apply to the doctor.
   * @returns A promise that resolves to the updated doctor.
   */
  async findByEmailAndUpdate(
    email: string,
    updateQuery: UpdateQuery<Doctor>,
  ): Promise<Doctor> {
    return await this.doctorModel.findOneAndUpdate({ email }, updateQuery, {
      new: true,
    });
  }
}
