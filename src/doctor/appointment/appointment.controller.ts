import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { IdParamsDto, QueryParamsDto } from '../../common/dto';

import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';
import { AuthGuard } from '@nestjs/passport';
import AUTH_GUARD from '../../common/constants/authGuards';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentByDoctorDto,
  SearchQueryAppointmentDto,
  SortQueryAppointmentDto,
  UpdateAppointmentByDoctorDto,
} from './dto';

/**
 * Controller responsible for handling HTTP requests related to appointments.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
@ApiTags('doctor/appointment')
export class AppointmentController {
  /**
   * Constructor for the AppointmentController class.
   *
   * @param appointmentService - The service responsible for managing appointments data.
   */
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Create a new appointment.
   *
   * @param createAppointmentDto - The data to create a new appointment.
   * @returns The created appointment object.
   */
  @Version('1')
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Appointment created successfully',
  })
  // @ApiBody({ schema: addStaff })
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentByDoctorDto,
    @Req() req: any,
  ) {
    const { patientId, date, time } = createAppointmentDto;
    const doctorId = req.user.id;

    //? Validate Patient and Doctor existence
    const patientExists = await this.appointmentService.doesPatientExist(
      `${patientId}`,
    );

    if (!patientExists) {
      throw new BadRequestException(
        `Patient with ID ${patientId} does not exist.`,
      );
    }

    //? Validate that the appointment date is not in the past
    const currentDateTime = new Date();

    if (date < currentDateTime) {
      throw new BadRequestException(
        'Appointment date and time must be in the future.',
      );
    }

    //? Check for conflicting appointments for the same doctor or patient
    const isConflicting =
      await this.appointmentService.isConflictingAppointment(
        `${patientId}`,
        `${doctorId}`,
        date,
        time,
      );
    if (isConflicting) {
      throw new BadRequestException(
        'There is already an appointment scheduled for this time.',
      );
    }

    return await this.appointmentService.createAppointment({
      doctorId,
      ...createAppointmentDto,
    });
  }

  /**
   * Retrieve a list of appointments based on specified query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for appointment data.
   * @param sort - The sorting criteria for the retrieved appointments.
   * @returns A list of appointments matching the specified criteria.
   */
  @Version('1')
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryAppointmentDto })
  @ApiQuery({ name: 'sort', type: SortQueryAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'List of appointments retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryAppointmentDto,
    @SortQuery() sort: SortQueryAppointmentDto,
  ) {
    return this.appointmentService.findAll(queryParams, search, sort);
  }

  /**
   * Retrieve information about a single appointment by its unique identifier.
   *
   * @param id - The unique identifier of the appointment to be retrieved.
   * @returns The appointment object if found.
   */
  @Version('1')
  @Get(':id')
  async findAppointment(@Param() { id }: IdParamsDto) {
    return await this.appointmentService.getAppointmentById(`${id}`);
  }

  /**
   * Update an existing appointment by ID.
   *
   * @param id - The ID of the appointment to update.
   * @param updateAppointmentDto - The data to update the appointment with.
   * @returns A success message or error.
   */
  @Version('1')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  @Patch(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentByDoctorDto,
    @Req() req: any,
  ) {
    const { patientId, date, time } = updateAppointmentDto;
    const doctorId = req.user.id;

    //? Validate if patientId exists
    if (patientId) {
      const patientExists = await this.appointmentService.doesPatientExist(
        `${patientId}`,
      );
      if (!patientExists) {
        throw new BadRequestException(
          `Patient with ID ${patientId} does not exist.`,
        );
      }
    }

    //? Validate if doctorId exists
    if (doctorId) {
      const doctorExists = await this.appointmentService.doesDoctorExist(
        `${doctorId}`,
      );
      if (!doctorExists) {
        throw new BadRequestException(
          `Doctor with ID ${doctorId} does not exist.`,
        );
      }
    }

    if (date) {
      const currentDateTime = new Date();

      if (date < currentDateTime) {
        throw new BadRequestException(
          'Appointment date must be in the future.',
        );
      }
    }

    //? Check for conflicting appointments
    if (date && (patientId || doctorId)) {
      const isConflicting =
        await this.appointmentService.isConflictingAppointment(
          `${patientId}`,
          `${doctorId}`,
          date,
          time,
          id,
        );
      if (isConflicting) {
        throw new BadRequestException(
          'There is already an appointment scheduled for this time.',
        );
      }
    }

    return await this.appointmentService.updateAppointment(id, {
      doctorId,
      ...updateAppointmentDto,
    });
  }

  /**
   * Delete an existing appointment by ID.
   *
   * @param id - The ID of the appointment to delete.
   * @returns A success message or error.
   */
  @Version('1')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Appointment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found',
  })
  async deleteAppointment(@Param() { id }: IdParamsDto) {
    // TODO : switch to soft delete later
    return await this.appointmentService.deleteAppointment(id);
  }
}
