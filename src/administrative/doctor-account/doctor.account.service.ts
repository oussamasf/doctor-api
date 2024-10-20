import { Injectable } from '@nestjs/common';

import { QueryParamsDto } from '../../common/dto';

import { FindAllReturn } from '../../common/types';
import {
  CreateDoctorDto,
  SearchQueryDoctorDto,
  SortQueryDoctorDto,
  UpdateDoctorDto,
} from 'src/doctor/dto';
import { Doctor } from 'src/doctor/profile/schemas/doctor.schema';
import { LazyModuleLoader } from '@nestjs/core';
import { DoctorProfileModule } from 'src/doctor/profile/doctor.profile.module';
import { DoctorProfileService } from 'src/doctor/profile/doctor.profile.service';

@Injectable()
export class DoctorRegistryServices {
  private doctorService?: DoctorProfileService;
  constructor(private readonly lazyModuleLoader: LazyModuleLoader) {}

  /**
   * Find and retrieve a list of doctors based on query parameters.
   *
   * @param query - The query parameters for filtering and pagination.
   * @param search - The search query for doctor data.
   * @param sort - The sorting criteria for the retrieved doctors.
   * @returns A promise that resolves to a list of doctors matching the specified criteria.
   */

  async findAll(
    query: QueryParamsDto,
    search: SearchQueryDoctorDto,
    sort: SortQueryDoctorDto,
  ): Promise<FindAllReturn<Doctor>> {
    await this._establishLazyService();
    return await this.doctorService.findAll(query, search, sort);
  }

  /**
   * Find and retrieve a single doctor by its unique identifier.
   *
   * @param _id - The unique identifier of the doctor to be retrieved.
   * @returns A promise that resolves to the doctor object if found.
   */
  async findOne(_id: string) {
    await this._establishLazyService();
    return await this.doctorService.findOneWithException(_id);
  }

  /**
   * Create a new doctor account.
   *
   * @param createDoctorDto - The data for the new doctor account to be created.
   * @returns A promise that resolves to the newly created doctor account.
   */
  async create(createDoctorDto: CreateDoctorDto) {
    await this._establishLazyService();
    return await this.doctorService.create(createDoctorDto);
  }

  /**
   * Update an existing doctor account.
   *
   * @param _id - The unique identifier of the doctor to be updated.
   * @param updateDoctorDto - The data for the updated doctor account.
   * @returns A promise that resolves to the updated doctor account.
   */
  async update(_id: string, updateDoctorDto: UpdateDoctorDto) {
    await this._establishLazyService();
    return await this.doctorService.update(_id, updateDoctorDto);
  }

  /**
   * Delete an existing doctor account.
   *
   * @param _id - The unique identifier of the doctor to be deleted.
   * @returns A promise that resolves to the deleted doctor account.
   */
  async delete(_id: string) {
    await this._establishLazyService();
    return await this.doctorService.delete(_id);
  }

  /**
   * Establishes a lazy reference to the DoctorProfileService.
   *
   * Since this DoctorRegistryServices is in the administrative module, which is
   * not dependent on the DoctorProfileModule, we need to use lazy loading to
   * establish the reference to the DoctorProfileService. This is called upon the
   * first request to the DoctorRegistryController.
   */
  private async _establishLazyService() {
    if (!this.doctorService) {
      const moduleRef = await this.lazyModuleLoader.load(
        () => DoctorProfileModule,
      );
      this.doctorService = moduleRef.get(DoctorProfileService);
    }
  }
}
