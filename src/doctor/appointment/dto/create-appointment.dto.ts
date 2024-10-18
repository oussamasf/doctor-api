import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  readonly patientId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
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
