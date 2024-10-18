import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  CreateAppointmentDto,
  SearchQueryAppointmentDto,
  SortQueryAppointmentDto,
  UpdateAppointmentDto,
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
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.createAppointment(
      createAppointmentDto,
    );
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
  async updateAppointment(
    @Param() { id }: IdParamsDto,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentService.updateAppointment(
      id,
      updateAppointmentDto,
    );
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
