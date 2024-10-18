import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEmail,
  MaxLength,
} from 'class-validator';
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
    message: 'Phone number must be a valid number with optional + prefix',
  })
  @ApiProperty()
  phoneNumber: string;

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
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  specialization: string;
}
