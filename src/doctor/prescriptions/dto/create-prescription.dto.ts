import {
  IsNotEmpty,
  IsArray,
  IsMongoId,
  IsString,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { OmitType } from '@nestjs/mapped-types';

class MedicationDto {
  @IsNotEmpty()
  @IsString()
  medication: string;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsNotEmpty()
  @IsString()
  frequency: string;
}

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly patientId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly doctorId: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  @ArrayMinSize(1)
  readonly medications: MedicationDto[];

  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly endDate: Date;
}

export class CreatePrescriptionByDoctorDto extends OmitType(
  CreatePrescriptionDto,
  ['doctorId'] as const,
) {}
