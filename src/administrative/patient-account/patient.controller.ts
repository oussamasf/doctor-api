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
import { PatientRegistryServices } from './patient.service';
import { IdParamsDto, QueryParamsDto } from '../../common/dto';

import {
  SearchQuery,
  SortQuery,
} from '../../common/decorators/query.param.decorator';
import { AuthGuard } from '@nestjs/passport';
import AUTH_GUARD from '../../common/constants/authGuards';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreatePatientDto,
  SearchQueryPatientDto,
  SortQueryPatientDto,
} from 'src/patient/dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ADMINISTRATIVE_ROLES } from '../account/constants/roles';
import { RoleGuard } from 'src/common/guards/roles.guard';

/**
 * Controller responsible for handling HTTP requests related to patients.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE))
@ApiTags('administrative/patient')
export class PatientRegistryController {
  /**
   * Constructor for the PatientController class.
   *
   * @param patientService - The service responsible for managing patients data.
   */
  constructor(private readonly patientService: PatientRegistryServices) {}

  /**
   * Retrieve a list of patients based on specified query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for patient data.
   * @param sort - The sorting criteria for the retrieved patients.
   * @returns A list of patients matching the specified criteria.
   */
  @Version('1')
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryPatientDto })
  @ApiQuery({ name: 'sort', type: SortQueryPatientDto })
  @ApiResponse({
    status: 200,
    description: 'List of patients retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryPatientDto,
    @SortQuery() sort: SortQueryPatientDto,
  ) {
    return this.patientService.findAll(queryParams, search, sort);
  }

  /**
   * Retrieve information about a single patient by its unique identifier.
   *
   * @param id - The unique identifier of the patient to be retrieved.
   * @returns The patient object if found.
   */
  @Version('1')
  @Get(':id')
  async findPatient(@Param() { id }: IdParamsDto) {
    return await this.patientService.findOne(`${id}`);
  }

  /**
   * Create a new patient.
   *
   * @param createPatientDto - The data to create a new patient.
   * @returns The created patient object.
   */
  @Version('1')
  @Post('/register')
  @Roles(ADMINISTRATIVE_ROLES.ADMIN)
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE), RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Patient created successfully',
  })
  // @ApiBody({ schema: addStaff })
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientService.create(createPatientDto);
  }

  /**
   * Delete an existing patient by ID.
   *
   * @param id - The ID of the patient to delete.
   * @returns A success message or error.
   */
  @Version('1')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Patient deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @Roles(ADMINISTRATIVE_ROLES.ADMIN)
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE), RoleGuard)
  async deletePatient(@Param() { id }: IdParamsDto) {
    // TODO : switch to soft delete later
    return await this.patientService.delete(id);
  }
}
