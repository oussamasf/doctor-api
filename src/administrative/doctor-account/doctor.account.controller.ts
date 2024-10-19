import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { DoctorRegistryServices } from './doctor.account.service';
import { IdParamsDto, QueryParamsDto } from '../../common/dto';

import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';
import { AuthGuard } from '@nestjs/passport';
import AUTH_GUARD from '../../common/constants/authGuards';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateDoctorDto,
  SearchQueryDoctorDto,
  SortQueryDoctorDto,
} from 'src/doctor/dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ADMINISTRATIVE_ROLES } from '../account/constants/roles';
import { RoleGuard } from 'src/common/guards/roles.guard';

/**
 * Controller responsible for handling HTTP requests related to doctors.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE))
@ApiTags('administrative/doctor')
export class DoctorRegistryController {
  /**
   * Constructor for the DoctorController class.
   *
   * @param doctorService - The service responsible for managing doctors data.
   */
  constructor(private readonly doctorService: DoctorRegistryServices) {}

  /**
   * Retrieve a list of doctors based on specified query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for doctor data.
   * @param sort - The sorting criteria for the retrieved doctors.
   * @returns A list of doctors matching the specified criteria.
   */
  @Version('1')
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryDoctorDto })
  @ApiQuery({ name: 'sort', type: SortQueryDoctorDto })
  @ApiResponse({
    status: 200,
    description: 'List of doctors retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryDoctorDto,
    @SortQuery() sort: SortQueryDoctorDto,
  ) {
    return this.doctorService.findAll(queryParams, search, sort);
  }

  /**
   * Retrieve information about a single doctor by its unique identifier.
   *
   * @param id - The unique identifier of the doctor to be retrieved.
   * @returns The doctor object if found.
   */
  @Version('1')
  @Get(':id')
  async findDoctor(@Param() { id }: IdParamsDto) {
    return await this.doctorService.findOne(`${id}`);
  }

  /**
   * Create a new doctor.
   *
   * @param createDoctorDto - The data to create a new doctor.
   * @returns The created doctor object.
   */
  @Version('1')
  @Post('/register')
  @Roles(ADMINISTRATIVE_ROLES.ADMIN)
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE), RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Doctor created successfully',
  })
  // @ApiBody({ schema: addStaff })
  async createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return await this.doctorService.create(createDoctorDto);
  }

  /**
   * Delete an existing doctor by ID.
   *
   * @param id - The ID of the doctor to delete.
   * @returns A success message or error.
   */
  @Version('1')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Doctor deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found',
  })
  @Roles(ADMINISTRATIVE_ROLES.ADMIN)
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE), RoleGuard)
  async deleteDoctor(@Param() { id }: IdParamsDto) {
    // TODO : switch to soft delete later
    return await this.doctorService.delete(id);
  }
}
