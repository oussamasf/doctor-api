import { OmitType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsDateString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly patientId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly doctorId: Types.ObjectId;

  @IsNotEmpty()
  @IsDateString()
  readonly date: Date;

  @IsNotEmpty()
  @IsString()
  readonly time: string;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;
}

export class CreateAppointmentByDoctorDto extends OmitType(
  CreateAppointmentDto,
  ['doctorId'] as const,
) {}
