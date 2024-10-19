import {
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ADMINISTRATIVE_ROLES } from '../account/constants/roles';
import { ApiProperty } from '@nestjs/swagger';
import { MatchPasswords } from 'src/common/decorators/matchPassword.decorator';
import { globalErrorMessages } from 'src/common/constants/errorMessages';

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

export class CreateAdministrativeDto {
  @IsString()
  @MinLength(2)
  username: string;

  @IsEnum(ADMINISTRATIVE_ROLES, {
    message: 'Role must be one of: admin, staff',
    each: true,
  })
  roles: ADMINISTRATIVE_ROLES[];

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
