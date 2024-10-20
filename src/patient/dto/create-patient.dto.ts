import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Matches,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MatchPasswords } from 'src/common/decorators/matchPassword.decorator';
import { globalErrorMessages } from 'src/common/constants/errorMessages';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ description: 'Unique username for the patient' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: globalErrorMessages.PASSWORD_TOO_SHORT,
  })
  @ApiProperty({ description: 'Password for the patient' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MatchPasswords('password', {
    message: globalErrorMessages.PASSWORDS_DO_NOT_MATCH,
  })
  @ApiProperty()
  confirmPassword: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Unique email address of the patient' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'First name of the patient', required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Last name of the patient', required: false })
  lastName?: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid number with optional + prefix',
  })
  @ApiProperty({ description: 'Phone number of the patient', required: false })
  phoneNumber: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Date of birth of the patient' })
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Address of the patient', required: false })
  address?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Array of doctor IDs associated with the patient',
    type: [String],
    required: false,
  })
  doctors?: Types.ObjectId[];

  @IsOptional()
  @ApiProperty({
    description: 'Array of appointment IDs for the patient',
    type: [String],
    required: false,
  })
  appointments?: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Array of prescription IDs for the patient',
    type: [String],
    required: false,
  })
  prescriptions?: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Array of medical history entries for the patient',
    type: [String],
    required: false,
  })
  medicalHistory?: string[];
}
