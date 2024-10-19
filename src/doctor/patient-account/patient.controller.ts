import {
  Controller,
  Get,
  Param,
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
import { SearchQueryPatientDto, SortQueryPatientDto } from 'src/patient/dto';
import { PatientProfileService } from 'src/patient/profile/patient.profile.service';

/**
 * Controller responsible for handling HTTP requests related to patients.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
@ApiTags('administrative/patient')
export class PatientRegistryController {
  /**
   * Constructor for the PatientController class.
   *
   * @param patientService - The service responsible for managing patients data.
   */
  constructor(private readonly patientService: PatientProfileService) {}

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
}
