import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { MedicalHistoryService } from './medical-history.service';
import {
  CreateMedicalHistoryByDoctorDto,
  SearchQueryMedicalHistoryDto,
  SortQueryMedicalHistoryDto,
  UpdateMedicalHistoryByDoctorDto,
} from './dto';
import {
  globalErrorMessages,
  patientErrorMessages,
  prescriptionErrorMessages,
} from 'src/common/constants/errorMessages';

/**
 * Controller responsible for handling HTTP requests related to medicalHistories.
 */
@Controller()
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
@ApiTags('doctor/medicalHistory')
export class MedicalHistoryController {
  /**
   * Constructor for the MedicalHistoryController class.
   *
   * @param medicalHistoryService - The service responsible for managing medicalHistories data.
   */
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  /**
   * Create a new medicalHistory.
   *
   * @param createMedicalHistoryDto - The data to create a new medicalHistory.
   * @returns The created medicalHistory object.
   */
  @Version('1')
  @Post()
  @ApiResponse({
    status: 200,
    description: 'MedicalHistory created successfully',
  })
  // @ApiBody({ schema: addStaff })
  async createMedicalHistory(
    @Body() createMedicalHistoryDto: CreateMedicalHistoryByDoctorDto,
    @Req() req: any,
  ) {
    const { patientId, prescriptionId } = createMedicalHistoryDto;
    const doctorId = req.user.id;

    const uniquePrescription = await this.medicalHistoryService.findOne({
      prescriptionId,
    });
    if (uniquePrescription) {
      throw new BadRequestException(
        `Prescription with ID ${prescriptionId} already exists.`,
      );
    }

    //? Validate Patient and Doctor existence
    const patientExists = await this.medicalHistoryService.doesPatientExist(
      `${patientId}`,
    );

    if (!patientExists) {
      throw new BadRequestException(patientErrorMessages.PATIENT_NOT_FOUND);
    }

    const prescriptionExists =
      await this.medicalHistoryService.doesPrescriptionExist(
        `${prescriptionId}`,
        `${doctorId}`,
      );
    if (!prescriptionExists) {
      throw new BadRequestException(
        prescriptionErrorMessages.PRESCRIPTION_NOT_FOUND,
      );
    }

    const item = await this.medicalHistoryService.createMedicalHistory({
      doctorId,
      ...createMedicalHistoryDto,
    });

    if (!item) {
      throw new InternalServerErrorException(
        globalErrorMessages.SOMETHING_WENT_WRONG,
      );
    }

    return item;
  }

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
  ) {
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
  async findMedicalHistory(@Param() { id }: IdParamsDto) {
    return await this.medicalHistoryService.getMedicalHistoryById(`${id}`);
  }

  /**
   * Update an existing medicalHistory by ID.
   *
   * @param id - The ID of the medicalHistory to update.
   * @param updateMedicalHistoryDto - The data to update the medicalHistory with.
   * @returns A success message or error.
   */
  @Version('1')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'MedicalHistory updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'MedicalHistory not found',
  })
  @Patch(':id')
  async updateMedicalHistory(
    @Param('id') id: string,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryByDoctorDto,
    @Req() req: any,
  ) {
    const { patientId, prescriptionId } = updateMedicalHistoryDto;
    const doctorId = req.user.id;

    //? Validate if patientId exists
    if (patientId) {
      const patientExists = await this.medicalHistoryService.doesPatientExist(
        `${patientId}`,
      );
      if (!patientExists) {
        throw new BadRequestException(patientErrorMessages.PATIENT_NOT_FOUND);
      }
    }

    if (prescriptionId) {
      const prescriptionExists =
        await this.medicalHistoryService.doesPrescriptionExist(
          `${prescriptionId}`,
          `${doctorId}`,
        );

      if (!prescriptionExists) {
        throw new BadRequestException(
          prescriptionErrorMessages.PRESCRIPTION_NOT_FOUND,
        );
      }
    }

    return await this.medicalHistoryService.updateMedicalHistory(id, {
      doctorId,
      ...updateMedicalHistoryDto,
    });
  }

  /**
   * Delete an existing medicalHistory by ID.
   *
   * @param id - The ID of the medicalHistory to delete.
   * @returns A success message or error.
   */
  @Version('1')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'MedicalHistory deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'MedicalHistory not found',
  })
  async deleteMedicalHistory(@Param() { id }: IdParamsDto) {
    // TODO : switch to soft delete later
    return await this.medicalHistoryService.deleteMedicalHistory(id);
  }
}
