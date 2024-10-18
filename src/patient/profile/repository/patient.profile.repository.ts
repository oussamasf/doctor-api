import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Patient, PatientDocument } from '../schemas/patient.schema';
import { CreatePatientDto, UpdatePatientDto } from 'src/patient/dto';
import { FindAllDto } from 'src/common/dto';
import { FindAllReturn } from 'src/common/types';

/**
 * Repository handling operations related to patient authentication.
 */
@Injectable()
export class PatientAuthRepository {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  /**
   * Finds a patient based on the provided filter query.
   * @param userFilterQuery The filter query to search for a patient.
   * @returns A promise that resolves to the found patient.
   */
  async findOne(userFilterQuery: FilterQuery<Patient>): Promise<Patient> {
    return this.patientModel.findOne(userFilterQuery);
  }

  /**
   * Finds patients based on the provided filter query.
   * @param usersFilterQuery The filter query to search for patients.
   * @returns A promise that resolves to an array of patients.
   */
  async find(usersFilterQuery: FindAllDto): Promise<FindAllReturn<Patient>> {
    usersFilterQuery.sort ? usersFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.patientModel
        .find(usersFilterQuery.search)
        .limit(usersFilterQuery.limit)
        .skip(usersFilterQuery.skip)
        .sort(usersFilterQuery.sort)
        .select('-password'),

      this.patientModel.countDocuments(usersFilterQuery.search),
    ]);
    return { results, count };
  }

  /**
   * Creates a new patient.
   * @param user The patient data to create.
   * @returns A promise that resolves to the created patient.
   */
  async create(user): Promise<Patient> {
    const newUser = new this.patientModel(user);
    return newUser.save();
  }

  /**
   * Finds and updates a patient based on the provided filter query and update query.
   * @param userFilterQuery The filter query to find the patient.
   * @param updateQuery The update query to apply to the patient.
   * @returns A promise that resolves to the updated patient.
   */
  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Patient>,
    updateQuery: UpdateQuery<Patient>,
  ): Promise<Patient> {
    return this.patientModel.findOneAndUpdate(userFilterQuery, updateQuery, {
      new: true,
    });
  }

  /**
   * Finds a patient by email and updates it based on the provided update query.
   * @param email The email of the patient to find.
   * @param updateQuery The update query to apply to the patient.
   * @returns A promise that resolves to the updated patient.
   */
  async findByEmailAndUpdate(
    email: string,
    updateQuery: UpdateQuery<Patient>,
  ): Promise<Patient> {
    return await this.patientModel.findOneAndUpdate({ email }, updateQuery, {
      new: true,
    });
  }

  /**
   * Creates multiple doctors in the database.
   * @param genres Array of objects containing doctor details to be created.
   * @returns Promise resolving to an array of created doctors.
   */
  async createMultiple(doctors: CreatePatientDto[]): Promise<Patient[]> {
    const newUsers = await this.patientModel.insertMany(doctors);
    return newUsers;
  }

  /**
   * Updates a doctor by its ID.
   * @param _id The ID of the doctor to be updated.
   * @param updateMovieDto Updated doctor details.
   * @returns Promise resolving to the updated doctor.
   */
  async updateById(
    _id: string,
    updateDoctorDto: UpdatePatientDto,
  ): Promise<Patient> {
    const updatedItem = await this.patientModel.findOneAndUpdate(
      { _id },
      updateDoctorDto,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a doctor by its ID.
   * @param _id The ID of the doctor to be deleted.
   * @returns Promise resolving to the deleted doctor.
   */
  async deleteById(_id: string): Promise<Patient> {
    const deletedItem = await this.patientModel.findOneAndDelete({ _id });
    return deletedItem;
  }
}