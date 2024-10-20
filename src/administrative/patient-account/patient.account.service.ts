import { Injectable } from '@nestjs/common';

import { QueryParamsDto } from '../../common/dto';

import { FindAllReturn } from '../../common/types';
import {
  CreatePatientDto,
  SearchQueryPatientDto,
  SortQueryPatientDto,
  UpdatePatientDto,
} from 'src/patient/dto';
import { Patient } from 'src/patient/profile/schemas/patient.schema';
import { PatientProfileService } from 'src/patient/profile/patient.profile.service';
import { LazyModuleLoader } from '@nestjs/core';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';

@Injectable()
export class PatientRegistryServices {
  private patientService?: PatientProfileService;

  constructor(private readonly lazyModuleLoader: LazyModuleLoader) {}

  /**
   * Find and retrieve a list of patients based on query parameters.
   *
   * @param query - The query parameters for filtering and pagination.
   * @param search - The search query for patient data.
   * @param sort - The sorting criteria for the retrieved patients.
   * @returns A promise that resolves to a list of patients matching the specified criteria.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryPatientDto,
    sort: SortQueryPatientDto,
  ): Promise<FindAllReturn<Patient>> {
    await this._establishLazyService();

    return await this.patientService.findAll(query, search, sort);
  }

  /**
   * Find and retrieve a single patient by its unique identifier.
   *
   * @param _id - The unique identifier of the patient to be retrieved.
   * @returns A promise that resolves to the patient object if found.
   */
  async findOne(_id: string) {
    await this._establishLazyService();

    return await this.patientService.findOneWithException(_id);
  }

  /**
   * Create a new patient account.
   *
   * @param createPatientDto - The data for the new patient account to be created.
   * @returns A promise that resolves to the newly created patient account.
   */
  // TODO handle duplicated keys
  async create(createPatientDto: CreatePatientDto) {
    await this._establishLazyService();

    return await this.patientService.create(createPatientDto);
  }

  /**
   * Update an existing patient account.
   *
   * @param _id - The unique identifier of the patient to be updated.
   * @param updatePatientDto - The data for the updated patient account.
   * @returns A promise that resolves to the updated patient account.
   */
  async update(_id: string, updatePatientDto: UpdatePatientDto) {
    await this._establishLazyService();

    return await this.patientService.update(_id, updatePatientDto);
  }

  /**
   * Delete an existing patient account.
   *
   * @param _id - The unique identifier of the patient to be deleted.
   * @returns A promise that resolves to the deleted patient account.
   */
  async delete(_id: string) {
    await this._establishLazyService();
    return await this.patientService.delete(_id);
  }

  /**
   * Establishes a lazy reference to the PatientProfileService.
   *
   * Loads the PatientProfileModule lazily and retrieves the PatientProfileService from the module reference.
   */
  private async _establishLazyService() {
    if (!this.patientService) {
      const moduleRef = await this.lazyModuleLoader.load(
        () => PatientProfileModule,
      );
      this.patientService = moduleRef.get(PatientProfileService);
    }
  }
}
