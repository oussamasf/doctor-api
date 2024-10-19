import { IsNotEmpty, IsMongoId, IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { OmitType } from '@nestjs/mapped-types';

export class CreateMedicalHistoryDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly patientId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly doctorId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly diagnosis: string;

  @IsNotEmpty()
  @IsString()
  readonly treatment: string;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}

export class CreateMedicalHistoryByDoctorDto extends OmitType(
  CreateMedicalHistoryDto,
  ['doctorId'] as const,
) {}
