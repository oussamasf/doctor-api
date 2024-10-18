import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Doctor, DoctorDocument } from '../schemas/doctor.schema';
import { CreateDoctorDto, UpdateDoctorDto } from 'src/doctor/dto';
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
  async findOne(userFilterQuery: FilterQuery<Doctor>): Promise<Doctor> {
    return this.doctorModel.findOne(userFilterQuery);
  }

  /**
   * Finds movies based on provided filters, with pagination support.
   * @param usersFilterQuery Filters and pagination parameters.
   * @returns Promise resolving to an object containing found movies and count.
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
   * Creates multiple doctors in the database.
   * @param genres Array of objects containing movie details to be created.
   * @returns Promise resolving to an array of created movies.
   */
  async createMultiple(doctors: CreateDoctorDto[]): Promise<Doctor[]> {
    const newUsers = await this.doctorModel.insertMany(doctors);
    return newUsers;
  }

  /**
   * Updates a movie by its ID.
   * @param _id The ID of the movie to be updated.
   * @param updateMovieDto Updated movie details.
   * @returns Promise resolving to the updated movie.
   */
  async updateById(
    _id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const updatedItem = await this.doctorModel.findOneAndUpdate(
      { _id },
      updateDoctorDto,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a movie by its ID.
   * @param _id The ID of the movie to be deleted.
   * @returns Promise resolving to the deleted movie.
   */
  async deleteById(_id: string): Promise<Doctor> {
    const deletedItem = await this.doctorModel.findOneAndDelete({ _id });
    return deletedItem;
  }
}
