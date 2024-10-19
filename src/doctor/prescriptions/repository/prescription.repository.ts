import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { FindAllReturn } from 'src/common/types';
import { FindAllDto } from 'src/common/dto';
import {
  Prescription,
  PrescriptionDocument,
} from '../schemas/prescription.schema';

/**
 * Repository handling operations related to Prescription authentication.
 */
@Injectable()
export class PrescriptionRepository {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  /**
   * Creates a new Prescription.
   * @param item The Prescription data to create.
   * @returns A promise that resolves to the created Prescription.
   */
  async create(item: Partial<Prescription>): Promise<Prescription> {
    const newItem = new this.prescriptionModel(item);
    return newItem.save();
  }

  /**
   * Finds a Prescription based on the provided filter query.
   * @param userFilterQuery The filter query to search for a Prescription.
   * @returns A promise that resolves to the found Prescription.
   */
  async findOne(
    userFilterQuery: FilterQuery<Prescription>,
  ): Promise<Prescription> {
    return this.prescriptionModel.findOne(userFilterQuery);
  }

  /**
   * Finds prescriptions based on provided filters, with pagination support.
   * @param itemsFilterQuery Filters and pagination parameters.
   * @returns Promise resolving to an object containing found prescriptions and count.
   */
  async findAndCount(
    itemsFilterQuery: FindAllDto,
  ): Promise<FindAllReturn<Prescription>> {
    itemsFilterQuery.sort ? itemsFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.prescriptionModel
        .find(itemsFilterQuery.search)
        .limit(itemsFilterQuery.limit)
        .skip(itemsFilterQuery.skip)
        .sort(itemsFilterQuery.sort),

      this.prescriptionModel.countDocuments(itemsFilterQuery.search),
    ]);
    return { results, count };
  }

  async find(query: FilterQuery<Prescription>): Promise<Prescription[]> {
    return this.prescriptionModel.find(query);
  }

  /**
   * Finds and updates a Prescription based on the provided filter query and update query.
   * @param itemFilterQuery The filter query to find the Prescription.
   * @param updateQuery The update query to apply to the Prescription.
   * @returns A promise that resolves to the updated Prescription.
   */
  async findOneAndUpdate(
    itemFilterQuery: FilterQuery<Prescription>,
    updateQuery: UpdateQuery<Prescription>,
  ): Promise<Prescription> {
    return this.prescriptionModel.findOneAndUpdate(
      itemFilterQuery,
      updateQuery,
      { new: true },
    );
  }

  /**
   * Updates a Prescription by its ID.
   * @param _id The ID of the Prescription to be updated.
   * @param updateMovieDto Updated Prescription details.
   * @returns Promise resolving to the updated Prescription.
   */
  async updateById(
    _id: string,
    items: Partial<Prescription>,
  ): Promise<Prescription> {
    const updatedItem = await this.prescriptionModel.findOneAndUpdate(
      { _id },
      items,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Updates a Prescription by its ID.
   * @param _id The ID of the Prescription to be updated.
   * @param updateMovieDto Updated Prescription details.
   * @returns Promise resolving to the updated Prescription.
   */
  async update(
    query: { _id: string; doctorId?: string },
    items: Partial<Prescription>,
  ): Promise<Prescription> {
    const updatedItem = await this.prescriptionModel.findOneAndUpdate(
      query,
      items,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a Prescription by its ID.
   * @param _id The ID of the Prescription to be deleted.
   * @returns Promise resolving to the deleted Prescription.
   */
  async deleteById(_id: string): Promise<Prescription> {
    const deletedItem = await this.prescriptionModel.findOneAndDelete({ _id });
    return deletedItem;
  }

  /**
   * Checks if a Prescription exists with the given ID.
   * @param _id The ID to check for.
   * @returns A promise that resolves to an object containing the ID if the Prescription exists, or null if it does not exist.
   */
  async exists(query: any) {
    return this.prescriptionModel.exists(query);
  }
}
