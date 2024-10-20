import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionRepository } from './repository/prescription.repository';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  SortQueryPrescriptionDto,
  SearchQueryPrescriptionDto,
} from './dto';
import { Prescription } from './schemas/prescription.schema';
import { QueryParamsDto } from 'src/common/dto';
import { FindAllReturn } from 'src/common/types';
import { DoctorProfileRepository } from '../profile/repository/doctor.profile.repository';
import { PatientProfileRepository } from 'src/patient/profile/repository/patient.profile.repository';
import { AppointmentRepository } from '../appointment/repository/appointment.repository';
import {
  Appointment,
  AppointmentStatus,
} from '../appointment/schemas/appointment.schema';
import {
  globalErrorMessages,
  prescriptionErrorMessages,
} from 'src/common/constants/errorMessages';
import { Types } from 'mongoose';

@Injectable()
export class PrescriptionService {
  constructor(
    private readonly prescriptionRepository: PrescriptionRepository,
    private readonly patientRepository: PatientProfileRepository,
    private readonly doctorRepository: DoctorProfileRepository,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  /**
   *  Creates an prescription.
   * @param createPrescriptionDto
   * @returns
   */
  async createPrescription(
    createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    const item = (await this.prescriptionRepository.create(
      createPrescriptionDto,
    )) as Prescription & { _id: Types.ObjectId };

    if (!item) {
      throw new InternalServerErrorException(
        globalErrorMessages.SOMETHING_WENT_WRONG,
      );
    }
    await this.patientRepository.updateById(`${item.patientId}`, {
      $push: {
        prescriptions: item._id,
      },
    });
    return item;
  }

  /**
   * Gets an prescription by ID.
   * @param id The ID of the prescription.
   * @returns The prescription.
   * @throws NotFoundException if the prescription is not found.
   */
  async getPrescriptionById(_id: string): Promise<Prescription> {
    const item = await this.prescriptionRepository.findOne({ _id });
    if (!item) {
      throw new NotFoundException(
        prescriptionErrorMessages.PRESCRIPTION_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Retrieves a list of prescriptions based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryPrescriptionDto} search - The search criteria to filter prescriptions (optional).
   * @param {SortQueryPrescriptionDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<Prescription>>} A Promise that resolves to a paginated list of prescriptions.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryPrescriptionDto,
    sort: SortQueryPrescriptionDto,
  ): Promise<FindAllReturn<Prescription>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.prescriptionRepository.findAndCount(findQuery);
  }

  async updatePrescription(
    id: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    const item = await this.prescriptionRepository.updateById(
      id,
      updatePrescriptionDto,
    );
    if (!item) {
      throw new NotFoundException(
        prescriptionErrorMessages.PRESCRIPTION_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Deletes an prescription by its ID.
   * @param {string} id - The id of the prescription to delete.
   * @returns {Promise<Prescription>} A Promise that resolves to the deleted prescription.
   * @throws {NotFoundException} If the prescription with the given ID is not found.
   */
  async deletePrescription(id: string): Promise<Prescription> {
    const item = await this.prescriptionRepository.deleteById(id);
    if (!item) {
      throw new NotFoundException(
        prescriptionErrorMessages.PRESCRIPTION_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Retrieves a list of prescriptions for the specified patient ID.
   * @param {string} patientId - The ID of the patient whose prescriptions to retrieve.
   * @returns {Promise<Prescription[]>} A Promise that resolves to an array of prescriptions.
   */
  async getPrescriptionByPatientId(
    _id: string,
    patientId: string,
  ): Promise<Prescription> {
    const item = await this.prescriptionRepository.findOne({ _id, patientId });
    if (!item) {
      throw new NotFoundException(
        prescriptionErrorMessages.PRESCRIPTION_NOT_FOUND,
      );
    }
    return item;
  }

  /**
   * Retrieves a list of prescriptions for the specified prescription ID.
   * @param {string} doctorId - The ID of the prescription whose doctor to retrieve.
   * @returns {Promise<Prescription[]>} A Promise that resolves to an array of prescriptions.
   */
  async getPrescriptionsByDoctorId(doctorId: string): Promise<Prescription[]> {
    return this.prescriptionRepository.find({ doctorId });
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
  async doesAppointmentExist(
    appointmentId: string,
    doctorId: string,
  ): Promise<boolean> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
    );

    //? only check for appointments in the next 24 hours
    const item = await this.appointmentRepository.exists({
      _id: appointmentId,
      doctorId: doctorId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: {
        $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
      },
    });
    return !!item;
  }

  /**
   * Marks an appointment as completed.
   *
   * @param {string} appointmentId - The ID of the appointment to mark as completed.
   * @returns {Promise<Appointment>} A Promise that resolves to the updated appointment.
   */
  async completeAppointment(appointmentId: string): Promise<Appointment> {
    const item = await this.appointmentRepository.update(
      { _id: appointmentId },
      {
        status: AppointmentStatus.COMPLETED,
      },
    );
    return item;
  }
}
