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
import { PrescriptionService } from './prescription.service';
import {
  CreatePrescriptionByDoctorDto,
  SearchQueryPrescriptionDto,
  SortQueryPrescriptionDto,
  UpdatePrescriptionByDoctorDto,
} from './dto';

/**
 * Controller responsible for handling HTTP requests related to prescriptions.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
@ApiTags('doctor/prescription')
export class PrescriptionController {
  /**
   * Constructor for the PrescriptionController class.
   *
   * @param prescriptionService - The service responsible for managing prescriptions data.
   */
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * Create a new prescription.
   *
   * @param createPrescriptionDto - The data to create a new prescription.
   * @returns The created prescription object.
   */
  @Version('1')
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Prescription created successfully',
  })
  // @ApiBody({ schema: addStaff })
  async createPrescription(
    @Body() createPrescriptionDto: CreatePrescriptionByDoctorDto,
    @Req() req: any,
  ) {
    const { patientId } = createPrescriptionDto;
    const doctorId = req.user.id;

    //? Validate Patient and Doctor existence
    const patientExists = await this.prescriptionService.doesPatientExist(
      `${patientId}`,
    );

    if (!patientExists) {
      throw new BadRequestException(
        `Patient with ID ${patientId} does not exist.`,
      );
    }

    return await this.prescriptionService.createPrescription({
      doctorId,
      ...createPrescriptionDto,
    });
  }

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
  ) {
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
  async findPrescription(@Param() { id }: IdParamsDto) {
    return await this.prescriptionService.getPrescriptionById(`${id}`);
  }

  /**
   * Update an existing prescription by ID.
   *
   * @param id - The ID of the prescription to update.
   * @param updatePrescriptionDto - The data to update the prescription with.
   * @returns A success message or error.
   */
  @Version('1')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Prescription updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Prescription not found',
  })
  @Patch(':id')
  async updatePrescription(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionByDoctorDto,
    @Req() req: any,
  ) {
    const { patientId } = updatePrescriptionDto;
    const doctorId = req.user.id;

    //? Validate if patientId exists
    if (patientId) {
      const patientExists = await this.prescriptionService.doesPatientExist(
        `${patientId}`,
      );
      if (!patientExists) {
        throw new BadRequestException(
          `Patient with ID ${patientId} does not exist.`,
        );
      }
    }

    return await this.prescriptionService.updatePrescription(id, {
      doctorId,
      ...updatePrescriptionDto,
    });
  }

  /**
   * Delete an existing prescription by ID.
   *
   * @param id - The ID of the prescription to delete.
   * @returns A success message or error.
   */
  @Version('1')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Prescription deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Prescription not found',
  })
  async deletePrescription(@Param() { id }: IdParamsDto) {
    // TODO : switch to soft delete later
    return await this.prescriptionService.deletePrescription(id);
  }
}
