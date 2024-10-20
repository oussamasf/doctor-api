import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { globalErrorMessages } from 'src/common/constants/errorMessages';
import { MatchPasswords } from 'src/common/decorators/matchPassword.decorator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: globalErrorMessages.INVALID_PHONE_NUMBER,
  })
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: globalErrorMessages.PASSWORDS_DO_NOT_MATCH,
  })
  @ApiProperty()
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
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  specialization: string;
}
