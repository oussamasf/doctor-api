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
import { DoctorProfileService } from './doctor.profile.service';

// Schemas
import { Doctor } from './schemas/Doctor.schema';
import { loginSchema } from './constants/swagger';

// DTOS
import { LoginDto } from './dto';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { LoginRes } from 'src/common/types';
import { ResetPasswordDto } from 'src/common/dto/reset-password.dto';

//? Controller class
@Controller()
@ApiTags('Doctor/account')
export class DoctorProfileController {
  /**
   * Constructor for DoctorAuthController
   * @param doctorProfileService - The DoctorAccountService instance used for authentication and user management.
   */
  constructor(private readonly doctorProfileService: DoctorProfileService) {}

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
    return await this.doctorProfileService.login(loginDto);
  }

  /**
   * Endpoint to retrieve the profile of the currently logged-in doctor.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to a Doctor object representing the logged-in doctor's profile.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
  @Get('/profile')
  async getLoggedUser(@Req() req: any): Promise<Doctor> {
    return req.user;
  }

  /**
   * Doctor logout endpoint.
   * @param req - The HTTP request object.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
  @Get('/logout')
  async logout(@Req() req: any) {
    await this.doctorProfileService.logout(req.user.email);
  }

  /**
   * Doctor token refresh endpoint.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to updated authentication tokens.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
  @Get('/refresh')
  async refresh(@Req() req: any) {
    return await this.doctorProfileService.refresh(req.user);
  }

  /**
   * Resets the password for the currently logged-in doctor.
   * @param resetPasswordDto - A ResetPasswordDto object containing the new password and email.
   * @param req - The HTTP request object.
   * @returns A Promise that resolves to the updated doctor object.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_DOCTOR))
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: any,
  ) {
    const { password, email } = resetPasswordDto;
    return await this.doctorProfileService.resetPassword(
      email,
      password,
      req.user.id,
    );
  }
}
