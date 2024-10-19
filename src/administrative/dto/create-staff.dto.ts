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
    message:
      'Password must be minimum 8 characters long and contain at least one letter and one number',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MatchPasswords('password', { message: 'Passwords do not match' })
  @ApiProperty()
  confirmPassword: string;

  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be minimum 8 characters long and contain at least one letter and one number',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MatchPasswords('password', { message: 'Passwords do not match' })
  @ApiProperty()
  confirmPassword: string;

  @IsEmail()
  email: string;
}
