import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreateMedicalHistoryByDoctorDto,
  CreateMedicalHistoryDto,
} from './create-medical-history.dto';

export class UpdateMedicalHistoryDto extends PartialType(
  OmitType(CreateMedicalHistoryDto, [] as const),
) {}

export class UpdateMedicalHistoryByDoctorDto extends PartialType(
  OmitType(CreateMedicalHistoryByDoctorDto, [] as const),
) {}
