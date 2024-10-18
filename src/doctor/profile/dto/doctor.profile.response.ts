import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../schemas/doctor.schema';

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: Omit<Doctor, 'password'>;
}
