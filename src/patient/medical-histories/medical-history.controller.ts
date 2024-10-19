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

import { MedicalHistoryService } from 'src/doctor/medical-histories/medical-history.service';
import {
  SearchQueryMedicalHistoryDto,
  SortQueryMedicalHistoryDto,
} from 'src/doctor/medical-histories/dto';

/**
 * Controller responsible for handling HTTP requests related to medicalHistories.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
@ApiTags('doctor/medicalHistory')
export class MedicalHistoryController {
  /**
   * Constructor for the MedicalHistoryController class.
   *
   * @param medicalHistoryService - The service responsible for managing medicalHistories data.
   */
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  /**
   * Retrieve a list of medicalHistories based on specified query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for medicalHistory data.
   * @param sort - The sorting criteria for the retrieved medicalHistories.
   * @returns A list of medicalHistories matching the specified criteria.
   */
  @Version('1')
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryMedicalHistoryDto })
  @ApiQuery({ name: 'sort', type: SortQueryMedicalHistoryDto })
  @ApiResponse({
    status: 200,
    description: 'List of medicalHistories retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryMedicalHistoryDto,
    @SortQuery() sort: SortQueryMedicalHistoryDto,
    @Req() req: any,
  ) {
    queryParams.query = { ...queryParams.query, patientId: req.user.id };
    return this.medicalHistoryService.findAll(queryParams, search, sort);
  }

  /**
   * Retrieve information about a single medicalHistory by its unique identifier.
   *
   * @param id - The unique identifier of the medicalHistory to be retrieved.
   * @returns The medicalHistory object if found.
   */
  @Version('1')
  @Get(':id')
  async findMedicalHistory(@Param() { id }: IdParamsDto, @Req() req: any) {
    return await this.medicalHistoryService.getMedicalHistoryByPatientId(
      `${id}`,
      req.user.id,
    );
  }
}
