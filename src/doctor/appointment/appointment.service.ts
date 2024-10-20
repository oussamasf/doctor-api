import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from './repository/appointment.repository';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  SortQueryAppointmentDto,
  SearchQueryAppointmentDto,
} from './dto';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema';
import { QueryParamsDto } from 'src/common/dto';
import { FindAllReturn } from 'src/common/types';
import { DoctorProfileRepository } from '../profile/repository/doctor.profile.repository';
import { PatientProfileRepository } from 'src/patient/profile/repository/patient.profile.repository';
import { addDays, getYYYYMMDD } from 'utils/time';
import { Types } from 'mongoose';
import {
  appointmentErrorMessages,
  globalErrorMessages,
} from 'src/common/constants/errorMessages';
import { LazyModuleLoader } from '@nestjs/core';
import { DoctorProfileModule } from '../profile/doctor.profile.module';
import { PatientProfileModule } from 'src/patient/profile/patient.profile.module';

@Injectable()
export class AppointmentService {
  private patientRepository?: PatientProfileRepository;
  private doctorRepository?: DoctorProfileRepository;

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  /**
   *  Creates an appointment.
   * @param createAppointmentDto
   * @returns
   */
  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this._establishLazyService();

    const item = (await this.appointmentRepository.create(
      createAppointmentDto,
    )) as Appointment & { _id: Types.ObjectId };

    if (!item) {
      throw new InternalServerErrorException(
        globalErrorMessages.SOMETHING_WENT_WRONG,
      );
    }

    await this.patientRepository.updateById(`${item.patientId}`, {
      $push: {
        appointments: item._id,
        doctors: item.doctorId,
      },
    });

    return item;
  }

  /**
   * Gets an appointment by ID.
   * @param id The ID of the appointment.
   * @returns The appointment.
   * @throws NotFoundException if the appointment is not found.
   */
  async getAppointmentById(_id: string): Promise<Appointment> {
    await this._establishLazyService();

    const item = await this.appointmentRepository.findOne({ _id });
    if (!item) {
      throw new NotFoundException(
        appointmentErrorMessages.APPOINTMENT_NOT_FOUND,
      );
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
    await this._establishLazyService();

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
      throw new NotFoundException(
        appointmentErrorMessages.APPOINTMENT_NOT_FOUND,
      );
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
    await this._establishLazyService();

    const item = await this.appointmentRepository.deleteById(id);
    if (!item) {
      throw new NotFoundException(
        appointmentErrorMessages.APPOINTMENT_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Retrieves a list of appointments for the specified patient ID.
   * @param {string} patientId - The ID of the patient whose appointments to retrieve.
   * @returns {Promise<Appointment[]>} A Promise that resolves to an array of appointments.
   */
  async getAppointmentByPatientId(
    _id: string,
    patientId: string,
  ): Promise<Appointment> {
    await this._establishLazyService();

    const item = await this.appointmentRepository.findOne({ _id, patientId });
    if (!item) {
      throw new NotFoundException(
        appointmentErrorMessages.APPOINTMENT_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Retrieves a list of appointments for the specified appointment ID.
   * @param {string} appointmentId - The ID of the appointment whose appointments to retrieve.
   * @returns {Promise<Appointment[]>} A Promise that resolves to an array of appointments.
   */
  async getAppointmentsByAppointmentId(
    doctorId: string,
  ): Promise<Appointment[]> {
    await this._establishLazyService();

    return this.appointmentRepository.find({ doctorId });
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
   * Checks if there is a conflicting appointment for a given patient or doctor at the specified date and time.
   *
   * @param {string} patientId - The ID of the patient to check for conflicts.
   * @param {string} doctorId - The ID of the doctor to check for conflicts.
   * @param {Date} date - The date of the appointment to check.
   * @param {string} time - The time of the appointment to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if there is a conflicting appointment, false otherwise.
   */
  // TODO give a window of permeability of appointment time
  async isConflictingAppointment(
    patientId: string,
    doctorId: string,
    date: Date,
    time: string,
    id?: string,
  ): Promise<boolean> {
    await this._establishLazyService();

    const patientConflicts = await this.appointmentRepository.find({
      _id: { $ne: id || new Types.ObjectId() },
      patientId,
      date: {
        $gte: getYYYYMMDD(date).toString(),
        $lt: addDays(date, 1).toString(),
      },
      time,
      status: { $ne: AppointmentStatus.CANCELLED },
    });
    const doctorConflicts = await this.appointmentRepository.find({
      _id: { $ne: id || new Types.ObjectId() },
      doctorId,
      date: {
        $gte: getYYYYMMDD(date).toString(),
        $lt: addDays(date, 1).toString(),
      },
      time,
      status: { $ne: AppointmentStatus.CANCELLED },
    });

    return patientConflicts.length > 0 || doctorConflicts.length > 0;
  }

  /**
   * Cancels an appointment by updating its status to CANCELLED.
   *
   * @param {string} id - The ID of the appointment to cancel.
   * @param {string} doctorId - The ID of the doctor canceling the appointment.
   * @returns {Promise<Appointment>} A Promise that resolves to the canceled appointment.
   * @throws {NotFoundException} If the appointment is not found.
   */
  async cancelAppointment(id: string, doctorId: string): Promise<Appointment> {
    await this._establishLazyService();

    const item = await this.appointmentRepository.update(
      { _id: id, doctorId },
      {
        status: AppointmentStatus.CANCELLED,
      },
    );
    if (!item) {
      throw new NotFoundException(
        appointmentErrorMessages.APPOINTMENT_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Establishes lazy references to the doctor and patient repositories.
   * If the doctor repository is not already loaded, it loads the DoctorProfileModule
   * and initializes the doctor repository. If the patient repository is not already loaded,
   * it loads the PatientProfileModule and initializes the patient repository.
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
  }
}
