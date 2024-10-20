import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import {
  globalErrorMessages,
  medicalHistoryErrorMessages,
} from 'src/common/constants/errorMessages';
import { Types } from 'mongoose';
import { LazyModuleLoader } from '@nestjs/core';
import { DoctorProfileModule } from '../profile/doctor.profile.module';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';
import { PrescriptionModule } from '../prescriptions/prescription.module';

@Injectable()
export class MedicalHistoryService {
  private patientRepository: PatientProfileRepository;
  private doctorRepository: DoctorProfileRepository;
  private prescriptionRepository: PrescriptionRepository;
  constructor(
    private readonly medicalHistoryRepository: MedicalHistoryRepository,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  /**
   *  Creates an medicalHistory.
   * @param createMedicalHistoryDto
   * @returns
   */
  async createMedicalHistory(
    createMedicalHistoryDto: CreateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    await this._establishLazyService();

    const item = (await this.medicalHistoryRepository.create(
      createMedicalHistoryDto,
    )) as MedicalHistory & { _id: Types.ObjectId };

    if (!item) {
      throw new InternalServerErrorException(
        globalErrorMessages.SOMETHING_WENT_WRONG,
      );
    }
    await this.patientRepository.updateById(`${item.patientId}`, {
      $push: {
        medicalHistory: item._id,
      },
    });
    return item;
  }

  /**
   * Finds a medicalHistory by the given filter query.
   * @param filterQuery The filter query to search for a medicalHistory.
   * @returns A promise that resolves to the found medicalHistory.
   */
  async findOne(
    filterQuery: FilterQuery<MedicalHistory>,
  ): Promise<MedicalHistory> {
    await this._establishLazyService();

    return this.medicalHistoryRepository.findOne(filterQuery);
  }

  /**
   * Gets an medicalHistory by ID.
   * @param id The ID of the medicalHistory.
   * @returns The medicalHistory.
   * @throws NotFoundException if the medicalHistory is not found.
   */
  async getMedicalHistoryById(_id: string): Promise<MedicalHistory> {
    await this._establishLazyService();

    const item = await this.medicalHistoryRepository.findOne({ _id });
    if (!item) {
      throw new NotFoundException(
        medicalHistoryErrorMessages.MEDICAL_HISTORY_NOT_FOUND,
      );
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
    await this._establishLazyService();

    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.medicalHistoryRepository.findAndCount(findQuery);
  }

  async updateMedicalHistory(
    id: string,
    updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    await this._establishLazyService();

    const item = await this.medicalHistoryRepository.updateById(
      id,
      updateMedicalHistoryDto,
    );
    if (!item) {
      throw new NotFoundException(
        medicalHistoryErrorMessages.MEDICAL_HISTORY_NOT_FOUND,
      );
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
    await this._establishLazyService();

    const item = await this.medicalHistoryRepository.deleteById(id);
    if (!item) {
      throw new NotFoundException(
        medicalHistoryErrorMessages.MEDICAL_HISTORY_NOT_FOUND,
      );
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
    await this._establishLazyService();

    const item = await this.medicalHistoryRepository.findOne({
      _id,
      patientId,
    });
    if (!item) {
      throw new NotFoundException(
        medicalHistoryErrorMessages.MEDICAL_HISTORY_NOT_FOUND,
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
    await this._establishLazyService();

    return this.medicalHistoryRepository.find({ doctorId });
  }

  /**
   * Checks if a doctor with the given ID exists.
   *
   * @param {string} doctorId - The ID of the doctor to check existence for.
   * @returns {Promise<boolean>} A Promise that resolves to true if the doctor exists, false otherwise.
   */
  async doesDoctorExist(doctorId: string): Promise<boolean> {
    await this._establishLazyService();

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
    await this._establishLazyService();

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
    await this._establishLazyService();

    const item = await this.prescriptionRepository.exists({
      _id: prescriptionId,
      doctorId,
    });
    return !!item;
  }

  /**
   * Establishes lazy references to the doctor, patient, and prescription repositories.
   *
   * If the doctor repository is not already loaded, it loads the DoctorProfileModule
   * and initializes the doctor repository. If the patient repository is not already loaded,
   * it loads the PatientProfileModule and initializes the patient repository.
   * If the prescription repository is not already loaded, it loads the PrescriptionModule
   * and initializes the prescription repository.
   */
  private async _establishLazyService() {
    if (!this.doctorRepository) {
      const moduleRef = await this.lazyModuleLoader.load(
        () => DoctorProfileModule,
      );
      this.doctorRepository = moduleRef.get(DoctorProfileRepository);
    }

    if (!this.patientRepository) {
      const moduleRef = await this.lazyModuleLoader.load(
        () => PatientProfileModule,
      );
      this.patientRepository = moduleRef.get(PatientProfileRepository);
    }

    if (!this.prescriptionRepository) {
      const moduleRef = await this.lazyModuleLoader.load(
        () => PrescriptionModule,
      );
      this.prescriptionRepository = moduleRef.get(PrescriptionRepository);
    }
  }
}
