import {
  Controller,
  Get,
  Param,
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
import {
  SearchQueryAppointmentDto,
  SortQueryAppointmentDto,
} from 'src/doctor/appointment/dto';
import { AppointmentService } from 'src/doctor/appointment/appointment.service';

/**
 * Controller responsible for handling HTTP requests related to appointments.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
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
    @Req() req: any,
  ) {
    search = { ...search, patientId: req.user.id };
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
  async findAppointment(@Param() { id }: IdParamsDto, @Req() req: any) {
    return await this.appointmentService.getAppointmentByPatientId(
      `${id}`,
      req.user.id,
    );
  }
}
