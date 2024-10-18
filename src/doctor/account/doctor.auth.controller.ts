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
import { DoctorAuthService } from './doctor.auth.service';

// Schemas
import { Doctor } from './schemas/Doctor.schema';
import { loginSchema } from './constants/swagger';

// DTOS
import { LoginDto } from './dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { LoginRes } from 'src/common/types';

//? Controller class
@Controller()
@ApiTags('Doctor/account')
export class DoctorAuthController {
  /**
   * Constructor for DoctorAuthController
   * @param doctorAuthService - The DoctorAuthService instance used for authentication and user management.
   */
  constructor(private readonly doctorAuthService: DoctorAuthService) {}

  /**
   * Doctor login endpoint.
   * @param loginDto - The LoginDto containing user login information.
   * @returns A Promise that resolves to a LoginRes<Doctor> with user information upon successful login.
   */
  @Version('1')
  @Post('/login')
  @ApiBody({ schema: loginSchema })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto): Promise<LoginRes<Doctor>> {
    return await this.doctorAuthService.login(loginDto);
  }

  /**
   * Endpoint to retrieve the profile of the currently logged-in doctor.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to a Doctor object representing the logged-in doctor's profile.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
  @Get('/profile')
  async getLoggedUser(@Req() req: any): Promise<Doctor> {
    return req.user;
  }

  /**
   * Doctor logout endpoint.
   * @param req - The HTTP request object.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
  @Get('/logout')
  async logout(@Req() req: any) {
    await this.doctorAuthService.logout(req.user.email);
  }

  /**
   * Doctor token refresh endpoint.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to updated authentication tokens.
   */
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_PATIENT))
  @Get('/refresh')
  async refresh(@Req() req: any) {
    return await this.doctorAuthService.refresh(req.user);
  }
}
