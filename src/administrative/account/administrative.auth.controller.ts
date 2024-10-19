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
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

// Service
import { AdministrativeService } from './administrative.service';

// Schemas
import { addStaff, loginSchema } from './constants/swagger';

// DTOS
import { CreateAdministrativeDto } from '../dto';
import { LoginDto } from './dto';

//Guards
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

// Constants
import AUTH_GUARD from '../../common/constants/authGuards';
import { Staff } from './schemas/administrative.schema';
import { LoginRes } from 'src/common/types';
import { ADMINISTRATIVE_ROLES } from './constants/roles';

/**
 * Controller handling authentication and management of administrative accounts.
 */
@Controller()
@ApiTags('Administrative/account')
export class administrativeAuthController {
  /**
   * Constructor for the AdministrativeAuthController class.
   *
   * @param administrativeService - The service responsible for administrative account operations.
   */
  constructor(private readonly administrativeService: AdministrativeService) {}

  /**
   * Authenticate a administrative staff by performing a login operation.
   *
   * @param loginDto - The login credentials of the administrative staff.
   * @returns A promise that resolves to an authentication response.
   */
  @Version('1')
  @Post('/login')
  @ApiBody({ schema: loginSchema })
  async login(@Body() loginDto: LoginDto): Promise<LoginRes<Staff>> {
    return await this.administrativeService.login(loginDto);
  }

  /**
   * Create a new administrative staff by super admin role.
   *
   * @param createAdministrativeDto - The data required to create a new administrative staff.
   * @returns The created administrative staff.
   */
  @Version('1')
  @Roles(ADMINISTRATIVE_ROLES.SUPER_ADMIN)
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE), RoleGuard)
  @Post('/staff')
  @ApiBody({ schema: addStaff })
  create(@Body() createAdministrativeDto: CreateAdministrativeDto) {
    return this.administrativeService.create(createAdministrativeDto);
  }

  /**
   * Retrieve the profile information of the currently logged-in administrative admin.
   *
   * @param req - The HTTP request object.
   * @returns The profile information of the logged-in administrative admin.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE))
  @Get('/profile')
  async getLoggedUser(@Req() req: Request) {
    return req.user;
  }

  /**
   * Logout a administrative user by revoking their access token.
   *
   * @param req - The HTTP request object containing user information.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_ADMINISTRATIVE))
  @Get('/logout')
  async logout(@Req() req: any) {
    await this.administrativeService.logout(req.user.email);
  }

  /**
   * Refresh the access token for a administrative user.
   *
   * @param req - The HTTP request object containing user information.
   * @returns An object containing the new access token.
   */
  @Version('1')
  @UseGuards(AuthGuard(AUTH_GUARD.REFRESH_TOKEN_ADMINISTRATIVE))
  @Get('/refresh')
  async refresh(@Req() req: any) {
    return await this.administrativeService.refresh(req.user);
  }
}

// TODO giving super-admin the privilege of creating another admin with password obligates making an endpoint to reset password for admins
