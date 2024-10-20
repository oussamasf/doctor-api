import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { globalErrorMessages } from '../constants/errorMessages';
import { ApiProperty } from '@nestjs/swagger';
import { MatchPasswords } from '../decorators/matchPassword.decorator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: globalErrorMessages.PASSWORD_TOO_SHORT,
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
  email: string;
}
