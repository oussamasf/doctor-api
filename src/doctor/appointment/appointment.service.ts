import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from './repository/appointment.repository';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  SortQueryAppointmentDto,
  SearchQueryAppointmentDto,
} from './dto';
import { Appointment } from './schemas/appointment.schema';
import { QueryParamsDto } from 'src/common/dto';
import { FindAllReturn } from 'src/common/types';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  /**
   *  Creates an appointment.
   * @param createAppointmentDto
   * @returns
   */
  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentRepository.create(createAppointmentDto);
  }

  /**
   * Gets an appointment by ID.
   * @param id The ID of the appointment.
   * @returns The appointment.
   * @throws NotFoundException if the appointment is not found.
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    const item = await this.appointmentRepository.findOne({ id });
    if (!item) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return item;
  }

  /**
   * Retrieves a list of appointments based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryAppointmentDto} search - The search criteria to filter appointments (optional).
   * @param {SortQueryAppointmentDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<Appointment>>} A Promise that resolves to a paginated list of appointments.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryAppointmentDto,
    sort: SortQueryAppointmentDto,
  ): Promise<FindAllReturn<Appointment>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.appointmentRepository.findAndCount(findQuery);
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const item = await this.appointmentRepository.updateById(
      id,
      updateAppointmentDto,
    );
    if (!item) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return item;
  }

  /**
   * Deletes an appointment by its ID.
   * @param {string} id - The id of the appointment to delete.
   * @returns {Promise<Appointment>} A Promise that resolves to the deleted appointment.
   * @throws {NotFoundException} If the appointment with the given ID is not found.
   */
  async deleteAppointment(id: string): Promise<Appointment> {
    const item = await this.appointmentRepository.deleteById(id);
    if (!item) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return item;
  }

  /**
   * Retrieves a list of appointments for the specified patient ID.
   * @param {string} patientId - The ID of the patient whose appointments to retrieve.
   * @returns {Promise<Appointment[]>} A Promise that resolves to an array of appointments.
   */
  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({ patientId });
  }

  /**
   * Retrieves a list of appointments for the specified appointment ID.
   * @param {string} appointmentId - The ID of the appointment whose appointments to retrieve.
   * @returns {Promise<Appointment[]>} A Promise that resolves to an array of appointments.
   */
  async getAppointmentsByAppointmentId(
    doctorId: string,
  ): Promise<Appointment[]> {
    return this.appointmentRepository.find({ doctorId });
  }
}
