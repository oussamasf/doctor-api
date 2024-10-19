import { Injectable, NotFoundException } from '@nestjs/common';
import { MedicalHistoryRepository } from './repository/medical-history.repository';
import {
  CreateMedicalHistoryDto,
  UpdateMedicalHistoryDto,
  SortQueryMedicalHistoryDto,
  SearchQueryMedicalHistoryDto,
} from './dto';
import { MedicalHistory } from './schemas/medical-history.schema';
import { QueryParamsDto } from 'src/common/dto';
import { FindAllReturn } from 'src/common/types';
import { DoctorProfileRepository } from '../profile/repository/doctor.profile.repository';
import { PatientProfileRepository } from 'src/patient/profile/repository/patient.profile.repository';
import { PrescriptionRepository } from '../prescriptions/repository/prescription.repository';
import { FilterQuery } from 'mongoose';

@Injectable()
export class MedicalHistoryService {
  constructor(
    private readonly medicalHistoryRepository: MedicalHistoryRepository,
    private readonly patientRepository: PatientProfileRepository,
    private readonly doctorRepository: DoctorProfileRepository,
    private readonly prescriptionRepository: PrescriptionRepository,
  ) {}

  /**
   *  Creates an medicalHistory.
   * @param createMedicalHistoryDto
   * @returns
   */
  async createMedicalHistory(
    createMedicalHistoryDto: CreateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    return this.medicalHistoryRepository.create(createMedicalHistoryDto);
  }

  /**
   * Finds a medicalHistory by the given filter query.
   * @param filterQuery The filter query to search for a medicalHistory.
   * @returns A promise that resolves to the found medicalHistory.
   */
  async findOne(
    filterQuery: FilterQuery<MedicalHistory>,
  ): Promise<MedicalHistory> {
    return this.medicalHistoryRepository.findOne(filterQuery);
  }

  /**
   * Gets an medicalHistory by ID.
   * @param id The ID of the medicalHistory.
   * @returns The medicalHistory.
   * @throws NotFoundException if the medicalHistory is not found.
   */
  async getMedicalHistoryById(_id: string): Promise<MedicalHistory> {
    const item = await this.medicalHistoryRepository.findOne({ _id });
    if (!item) {
      throw new NotFoundException(`MedicalHistory with ID ${_id} not found`);
    }
    return item;
  }

  /**
   * Retrieves a list of medicalHistories based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryMedicalHistoryDto} search - The search criteria to filter medicalHistories (optional).
   * @param {SortQueryMedicalHistoryDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<MedicalHistory>>} A Promise that resolves to a paginated list of medicalHistories.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryMedicalHistoryDto,
    sort: SortQueryMedicalHistoryDto,
  ): Promise<FindAllReturn<MedicalHistory>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.medicalHistoryRepository.findAndCount(findQuery);
  }

  async updateMedicalHistory(
    id: string,
    updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    const item = await this.medicalHistoryRepository.updateById(
      id,
      updateMedicalHistoryDto,
    );
    if (!item) {
      throw new NotFoundException(`MedicalHistory with ID ${id} not found`);
    }
    return item;
  }

  /**
   * Deletes an medicalHistory by its ID.
   * @param {string} id - The id of the medicalHistory to delete.
   * @returns {Promise<MedicalHistory>} A Promise that resolves to the deleted medicalHistory.
   * @throws {NotFoundException} If the medicalHistory with the given ID is not found.
   */
  async deleteMedicalHistory(id: string): Promise<MedicalHistory> {
    const item = await this.medicalHistoryRepository.deleteById(id);
    if (!item) {
      throw new NotFoundException(`MedicalHistory with ID ${id} not found`);
    }
    return item;
  }

  /**
   * Retrieves a list of medicalHistories for the specified patient ID.
   * @param {string} patientId - The ID of the patient whose medicalHistories to retrieve.
   * @returns {Promise<MedicalHistory[]>} A Promise that resolves to an array of medicalHistories.
   */
  async getMedicalHistoryByPatientId(
    _id: string,
    patientId: string,
  ): Promise<MedicalHistory> {
    const item = await this.medicalHistoryRepository.findOne({
      _id,
      patientId,
    });
    if (!item) {
      throw new NotFoundException(
        `MedicalHistory with ID ${_id} made by ${patientId} not found`,
      );
    }
    return item;
  }

  /**
   * Retrieves a list of medicalHistories for the specified medicalHistory ID.
   * @param {string} doctorId - The ID of the medicalHistory whose doctor to retrieve.
   * @returns {Promise<MedicalHistory[]>} A Promise that resolves to an array of medicalHistories.
   */
  async getMedicalHistoriesByDoctorId(
    doctorId: string,
  ): Promise<MedicalHistory[]> {
    return this.medicalHistoryRepository.find({ doctorId });
  }

  /**
   * Checks if a doctor with the given ID exists.
   *
   * @param {string} doctorId - The ID of the doctor to check existence for.
   * @returns {Promise<boolean>} A Promise that resolves to true if the doctor exists, false otherwise.
   */
  async doesDoctorExist(doctorId: string): Promise<boolean> {
    const doctor = await this.doctorRepository.exists(doctorId);
    return !!doctor;
  }

  /**
   * Checks if a patient with the given ID exists.
   *
   * @param {string} patientId - The ID of the patient to check existence for.
   * @returns {Promise<boolean>} A Promise that resolves to true if the patient exists, false otherwise.
   */
  async doesPatientExist(patientId: string): Promise<boolean> {
    const patient = await this.patientRepository.exists(patientId);
    return !!patient;
  }

  /**
   * Checks if a patient with the given ID exists.
   *
   * @param {string} patientId - The ID of the patient to check existence for.
   * @returns {Promise<boolean>} A Promise that resolves to true if the patient exists, false otherwise.
   */
  async doesPrescriptionExist(
    prescriptionId: string,
    doctorId: string,
  ): Promise<boolean> {
    const item = await this.prescriptionRepository.exists({
      _id: prescriptionId,
      doctorId,
    });
    return !!item;
  }
}
