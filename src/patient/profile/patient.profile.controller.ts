import {
  Controller,
  Get,
  Post,
  Body,
  Version,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

// Service
import { PatientProfileService } from './patient.profile.service';

// Schemas
import { Patient } from './schemas/patient.schema';
import { loginSchema } from './constants/swagger';

// DTOS
import { LoginDto } from './dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { LoginRes } from 'src/common/types';

//? Controller class
@Controller()
@ApiTags('Patient/account')
export class PatientAuthController {
  /**
   * Constructor for PatientAuthController
   * @param patientAuthService - The PatientAuthService instance used for authentication and user management.
   */
  constructor(private readonly patientProfileService: PatientProfileService) {}

  /**
   * Patient login endpoint.
   * @param loginDto - The LoginDto containing user login information.
   * @returns A Promise that resolves to a LoginRes<Patient> with user information upon successful login.
   */
  @Version('1')
  @Post('/login')
  @ApiBody({ schema: loginSchema })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto): Promise<LoginRes<Patient>> {
    return await this.patientProfileService.login(loginDto);
  }

  /**
   * Endpoint to retrieve the profile of the currently logged-in patient.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to a Patient object representing the logged-in patient's profile.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
  @Get('/profile')
  async getLoggedUser(@Req() req: any): Promise<Patient> {
    return req.user;
  }

  /**
   * Patient logout endpoint.
   * @param req - The HTTP request object.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
  @Get('/logout')
  async logout(@Req() req: any) {
    await this.patientProfileService.logout(req.user.email);
  }

  /**
   * Patient token refresh endpoint.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to updated authentication tokens.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
  @Get('/refresh')
  async refresh(@Req() req: any) {
    return await this.patientProfileService.refresh(req.user);
  }
}
