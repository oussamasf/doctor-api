import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, ['password', 'confirmPassword'] as const),
) {}
