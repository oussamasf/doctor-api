import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreatePrescriptionByDoctorDto,
  CreatePrescriptionDto,
} from './create-prescription.dto';

export class UpdatePrescriptionDto extends PartialType(
  OmitType(CreatePrescriptionDto, [] as const),
) {}

export class UpdatePrescriptionByDoctorDto extends PartialType(
  OmitType(CreatePrescriptionByDoctorDto, [] as const),
) {}
