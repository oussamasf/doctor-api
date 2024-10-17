import { PartialType } from '@nestjs/mapped-types';
import { CreateAdministrativeDto } from './create-staff.dto';

export class UpdateAdministrativeDto extends PartialType(
  CreateAdministrativeDto,
) {}
