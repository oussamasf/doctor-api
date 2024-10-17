import { ApiProperty } from '@nestjs/swagger';
import { Staff } from '../schemas/administrative.schema';

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: Omit<Staff, 'password'>;
}
