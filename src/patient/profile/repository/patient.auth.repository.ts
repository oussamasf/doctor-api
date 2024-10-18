import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Patient, PatientDocument } from '../schemas/patient.schema';

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
  async find(usersFilterQuery: FilterQuery<Patient>): Promise<Patient[]> {
    return this.patientModel.find(usersFilterQuery);
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
}
