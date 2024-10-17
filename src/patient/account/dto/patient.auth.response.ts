import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../schemas/patient.schema';

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: Omit<Patient, 'password'>;
}
