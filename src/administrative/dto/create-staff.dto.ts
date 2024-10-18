import { IsString, MinLength, IsEmail, IsEnum } from 'class-validator';
import { ADMINISTRATIVE_ROLES } from '../account/constants/roles';

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
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
