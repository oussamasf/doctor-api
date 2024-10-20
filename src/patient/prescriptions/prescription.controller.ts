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
import { PrescriptionService } from 'src/doctor/prescriptions/prescription.service';
import {
  SearchQueryPrescriptionDto,
  SortQueryPrescriptionDto,
} from 'src/doctor/prescriptions/dto';

/**
 * Controller responsible for handling HTTP requests related to prescriptions.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
@ApiTags('doctor/prescription')
export class PrescriptionController {
  /**
   * Constructor for the PrescriptionController class.
   *
   * @param prescriptionService - The service responsible for managing prescriptions data.
   */
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * Retrieve a list of prescriptions based on specified query parameters.
   *
   * @param queryParams - The query parameters for filtering and pagination.
   * @param search - The search query for prescription data.
   * @param sort - The sorting criteria for the retrieved prescriptions.
   * @returns A list of prescriptions matching the specified criteria.
   */
  @Version('1')
  @Get()
  @ApiQuery({ name: 'queryParams', type: QueryParamsDto })
  @ApiQuery({ name: 'search', type: SearchQueryPrescriptionDto })
  @ApiQuery({ name: 'sort', type: SortQueryPrescriptionDto })
  @ApiResponse({
    status: 200,
    description: 'List of prescriptions retrieved successfully',
  })
  findAll(
    @Query() queryParams: QueryParamsDto,
    @SearchQuery() search: SearchQueryPrescriptionDto,
    @SortQuery() sort: SortQueryPrescriptionDto,
    @Req() req: any,
  ) {
    search = { ...search, patientId: req.user.id };
    return this.prescriptionService.findAll(queryParams, search, sort);
  }

  /**
   * Retrieve information about a single prescription by its unique identifier.
   *
   * @param id - The unique identifier of the prescription to be retrieved.
   * @returns The prescription object if found.
   */
  @Version('1')
  @Get(':id')
  async findPrescription(@Param() { id }: IdParamsDto, @Req() req: any) {
    return await this.prescriptionService.getPrescriptionByPatientId(
      `${id}`,
      req.user.id,
    );
  }
}
