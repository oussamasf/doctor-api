import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { FindAllReturn } from 'src/common/types';
import { FindAllDto } from 'src/common/dto';
import {
  MedicalHistory,
  MedicalHistoryDocument,
} from '../schemas/medical-history.schema';

/**
 * Repository handling operations related to MedicalHistory
 */
@Injectable()
export class MedicalHistoryRepository {
  constructor(
    @InjectModel(MedicalHistory.name)
    private medicalHistoryModel: Model<MedicalHistoryDocument>,
  ) {}

  /**
   * Creates a new MedicalHistory.
   * @param item The MedicalHistory data to create.
   * @returns A promise that resolves to the created MedicalHistory.
   */
  async create(item: Partial<MedicalHistory>): Promise<MedicalHistory> {
    const newItem = new this.medicalHistoryModel(item);
    return newItem.save();
  }

  /**
   * Finds a MedicalHistory based on the provided filter query.
   * @param userFilterQuery The filter query to search for a MedicalHistory.
   * @returns A promise that resolves to the found MedicalHistory.
   */
  async findOne(
    userFilterQuery: FilterQuery<MedicalHistory>,
  ): Promise<MedicalHistory> {
    return this.medicalHistoryModel.findOne(userFilterQuery);
  }

  /**
   * Finds medicalHistories based on provided filters, with pagination support.
   * @param itemsFilterQuery Filters and pagination parameters.
   * @returns Promise resolving to an object containing found medicalHistories and count.
   */
  async findAndCount(
    itemsFilterQuery: FindAllDto,
  ): Promise<FindAllReturn<MedicalHistory>> {
    itemsFilterQuery.sort ? itemsFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.medicalHistoryModel
        .find(itemsFilterQuery.search)
        .limit(itemsFilterQuery.limit)
        .skip(itemsFilterQuery.skip)
        .sort(itemsFilterQuery.sort),

      this.medicalHistoryModel.countDocuments(itemsFilterQuery.search),
    ]);
    return { results, count };
  }

  async find(query: FilterQuery<MedicalHistory>): Promise<MedicalHistory[]> {
    return this.medicalHistoryModel.find(query);
  }

  /**
   * Finds and updates a MedicalHistory based on the provided filter query and update query.
   * @param itemFilterQuery The filter query to find the MedicalHistory.
   * @param updateQuery The update query to apply to the MedicalHistory.
   * @returns A promise that resolves to the updated MedicalHistory.
   */
  async findOneAndUpdate(
    itemFilterQuery: FilterQuery<MedicalHistory>,
    updateQuery: UpdateQuery<MedicalHistory>,
  ): Promise<MedicalHistory> {
    return this.medicalHistoryModel.findOneAndUpdate(
      itemFilterQuery,
      updateQuery,
      { new: true },
    );
  }

  /**
   * Creates multiple medicalHistories in the database.
   * @param genres Array of objects containing MedicalHistory details to be created.
   * @returns Promise resolving to an array of created medicalHistories.
   */
  async createMultiple(
    items: Partial<MedicalHistory>[],
  ): Promise<Partial<MedicalHistory>[]> {
    const newItems = await this.medicalHistoryModel.insertMany(items);
    return newItems;
  }

  /**
   * Updates a MedicalHistory by its ID.
   * @param _id The ID of the MedicalHistory to be updated.
   * @param updateMovieDto Updated MedicalHistory details.
   * @returns Promise resolving to the updated MedicalHistory.
   */
  async updateById(
    _id: string,
    items: Partial<MedicalHistory>,
  ): Promise<MedicalHistory> {
    const updatedItem = await this.medicalHistoryModel.findOneAndUpdate(
      { _id },
      items,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Updates a MedicalHistory by its ID.
   * @param _id The ID of the MedicalHistory to be updated.
   * @param updateMovieDto Updated MedicalHistory details.
   * @returns Promise resolving to the updated MedicalHistory.
   */
  async update(
    query: { _id: string; doctorId?: string },
    items: Partial<MedicalHistory>,
  ): Promise<MedicalHistory> {
    const updatedItem = await this.medicalHistoryModel.findOneAndUpdate(
      query,
      items,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a MedicalHistory by its ID.
   * @param _id The ID of the MedicalHistory to be deleted.
   * @returns Promise resolving to the deleted MedicalHistory.
   */
  async deleteById(_id: string): Promise<MedicalHistory> {
    const deletedItem = await this.medicalHistoryModel.findOneAndDelete({
      _id,
    });
    return deletedItem;
  }
}
