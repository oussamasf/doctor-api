import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';

import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { UpdateDoctorDto } from 'src/doctor/dto';
import { FindAllReturn } from 'src/common/types';
import { FindAllDto } from 'src/common/dto';

/**
 * Repository handling operations related to doctor authentication.
 */
@Injectable()
export class DoctorProfileRepository {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  /**
   * Finds a Doctor based on the provided filter query.
   * @param userFilterQuery The filter query to search for a Doctor.
   * @returns A promise that resolves to the found Doctor.
   */
  async findOne(filterQuery: FilterQuery<Doctor>): Promise<Doctor> {
    return this.doctorModel.findOne(filterQuery);
  }

  /**
   * Finds doctors based on provided filters, with pagination support.
   * @param usersFilterQuery Filters and pagination parameters.
   * @returns Promise resolving to an object containing found doctors and count.
   */
  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Doctor>> {
    usersFilterQuery.sort ? usersFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.doctorModel
        .find(usersFilterQuery.search)
        .limit(usersFilterQuery.limit)
        .skip(usersFilterQuery.skip)
        .sort(usersFilterQuery.sort)
        .select('-password'),

      this.doctorModel.countDocuments(usersFilterQuery.search),
    ]);
    return { results, count };
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

  /**
   * Updates a doctor by its ID.
   * @param _id The ID of the doctor to be updated.
   * @param updateMovieDto Updated doctor details.
   * @returns Promise resolving to the updated doctor.
   */
  async updateById(
    _id: string,
    updateQuery: UpdateQuery<UpdateDoctorDto>,
  ): Promise<Doctor> {
    const updatedItem = await this.doctorModel.findOneAndUpdate(
      { _id },
      updateQuery,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a doctor by its ID.
   * @param _id The ID of the doctor to be deleted.
   * @returns Promise resolving to the deleted doctor.
   */
  async deleteById(_id: string): Promise<Doctor> {
    const deletedItem = await this.doctorModel.findOneAndDelete({ _id });
    return deletedItem;
  }

  /**
   * Checks if a doctor exists with the given ID.
   * @param id The ID to check for.
   * @returns A promise that resolves to an object containing the ID if the doctor exists, or null if the doctor does not exist.
   */
  async exists(_id: string): Promise<{ _id: Types.ObjectId }> {
    return this.doctorModel.exists({ _id });
  }
}
