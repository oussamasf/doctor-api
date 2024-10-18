import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { FindAllReturn } from 'src/common/types';
import { FindAllDto } from 'src/common/dto';
import {
  Appointment,
  AppointmentDocument,
} from '../schemas/appointment.schema';

/**
 * Repository handling operations related to Appointment authentication.
 */
@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  /**
   * Creates a new Appointment.
   * @param item The Appointment data to create.
   * @returns A promise that resolves to the created Appointment.
   */
  async create(item: Partial<Appointment>): Promise<Appointment> {
    const newItem = new this.appointmentModel(item);
    return newItem.save();
  }

  /**
   * Finds a Appointment based on the provided filter query.
   * @param userFilterQuery The filter query to search for a Appointment.
   * @returns A promise that resolves to the found Appointment.
   */
  async findOne(
    userFilterQuery: FilterQuery<Appointment>,
  ): Promise<Appointment> {
    return this.appointmentModel.findOne(userFilterQuery);
  }

  /**
   * Finds appointments based on provided filters, with pagination support.
   * @param itemsFilterQuery Filters and pagination parameters.
   * @returns Promise resolving to an object containing found appointments and count.
   */
  async findAndCount(
    itemsFilterQuery: FindAllDto,
  ): Promise<FindAllReturn<Appointment>> {
    itemsFilterQuery.sort ? itemsFilterQuery.sort : { _id: 1 };
    const [results, count] = await Promise.all([
      this.appointmentModel
        .find(itemsFilterQuery.search)
        .limit(itemsFilterQuery.limit)
        .skip(itemsFilterQuery.skip)
        .sort(itemsFilterQuery.sort),

      this.appointmentModel.countDocuments(itemsFilterQuery.search),
    ]);
    return { results, count };
  }

  async find(query: FilterQuery<Appointment>): Promise<Appointment[]> {
    return this.appointmentModel.find(query);
  }

  /**
   * Finds and updates a Appointment based on the provided filter query and update query.
   * @param itemFilterQuery The filter query to find the Appointment.
   * @param updateQuery The update query to apply to the Appointment.
   * @returns A promise that resolves to the updated Appointment.
   */
  async findOneAndUpdate(
    itemFilterQuery: FilterQuery<Appointment>,
    updateQuery: UpdateQuery<Appointment>,
  ): Promise<Appointment> {
    return this.appointmentModel.findOneAndUpdate(
      itemFilterQuery,
      updateQuery,
      { new: true },
    );
  }

  /**
   * Creates multiple appointments in the database.
   * @param genres Array of objects containing Appointment details to be created.
   * @returns Promise resolving to an array of created appointments.
   */
  async createMultiple(
    items: Partial<Appointment>[],
  ): Promise<Partial<Appointment>[]> {
    const newItems = await this.appointmentModel.insertMany(items);
    return newItems;
  }

  /**
   * Updates a Appointment by its ID.
   * @param _id The ID of the Appointment to be updated.
   * @param updateMovieDto Updated Appointment details.
   * @returns Promise resolving to the updated Appointment.
   */
  async updateById(
    _id: string,
    items: Partial<Appointment>,
  ): Promise<Appointment> {
    const updatedItem = await this.appointmentModel.findOneAndUpdate(
      { _id },
      items,
      { new: true },
    );

    return updatedItem;
  }

  /**
   * Deletes a Appointment by its ID.
   * @param _id The ID of the Appointment to be deleted.
   * @returns Promise resolving to the deleted Appointment.
   */
  async deleteById(_id: string): Promise<Appointment> {
    const deletedItem = await this.appointmentModel.findOneAndDelete({ _id });
    return deletedItem;
  }
}
