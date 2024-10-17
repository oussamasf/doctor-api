import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

// DB actor
import { PatientAuthRepository } from './repository/patient.auth.repository';

// DTOS
import { LoginDto } from './dto/';

// Constants
import { global as globalErrorMessages } from '../../common/constants/errorMessages';
import { CommonService } from '../../common/common.service';
import { Patient } from './schemas/patient.schema';
import { LoginRes } from '../../common/types';

/**
 * Injectable service class for managing patient authentication.
 * @class
 */
@Injectable()
export class PatientAuthService {
  /**
   * Constructor for the PatientAuthService class.
   *
   * @constructor
   * @param {PatientAuthRepository} private readonly patientAuthRepository - The patient repository.
   * @param {JwtService} private readonly jwtService - The JWT service for token generation.
   * @param {CommonService} private readonly commonService - The common service for utility functions.
   * @param {ConfigService} private readonly configService - The configuration service.
   */
  constructor(
    private readonly patientAuthRepository: PatientAuthRepository,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Find a patient by ID.
   *
   * @param {string} _id - The ID of the patient to find.
   * @returns {Promise<Patient>} A promise that resolves to the found patient.
   */
  findOne(
    _id: string, //:  Promise<User>
  ) {
    return this.patientAuthRepository.findOne({ _id });
  }

  /**
   * Find a patient by email.
   *
   * @param {string} email - The email of the patient to find.
   * @returns {Promise<Patient>} A promise that resolves to the found patient.
   */
  async getUserByName(username: string) {
    return await this.patientAuthRepository.findOne({ username });
  }

  /**
   * Log in a patient.
   *
   * @param {LoginDto} loginDto - The login DTO containing email and password.
   * @returns {Promise<LoginRes<Patient>>} A promise that resolves to the login response including tokens and user information.
   */
  async login(loginDto: LoginDto): Promise<LoginRes<Patient>> {
    const { username, password } = loginDto;

    const user = await this.commonService.findWithNotFoundException(
      () => this.getUserByName(username),
      globalErrorMessages.USER_NOT_FOUND,
    );

    await this.commonService.validatePassword(
      password,
      user.password,
      globalErrorMessages.INVALID_PASSWORD,
    );
    const [access_token, refresh_token] = await Promise.all([
      this.getAccessToken(user.email, user.username),
      this.getRefreshToken(user.email, user.username),
    ]);
    await this.updateRefreshTokenHash(user.email, refresh_token);

    user.password = undefined;
    user.refreshToken = undefined;
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  /**
   * Log out a patient by removing the refresh token.
   *
   * @param {string} email - The email of the patient to log out.
   * @returns {Promise<void>} A promise that resolves when the patient is logged out.
   */
  async logout(email: string) {
    return await this.patientAuthRepository.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1 } },
    );
  }

  /**
   * Refresh the access token for a patient.
   *
   * @param {Patient} user - The patient user for whom to refresh the access token.
   * @returns {Promise<{ access_token: string }>} A promise that resolves to the new access token.
   */
  async refresh(user: Patient) {
    const access_token = await this.getAccessToken(user.email, user.username);
    return { access_token };
  }

  /**
   * Generate an access token for a patient.
   *
   * @param {string} email - The email of the patient.
   * @param {string} username - The username of the patient.
   * @returns {Promise<string>} A promise that resolves to the generated access token.
   */
  async getAccessToken(email: string, username: string): Promise<string> {
    return await this.jwtService.signAsync(
      { email, username },
      {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
        secret: this.configService.get('ACCESS_TOKEN_SECRET_CLIENT'),
      },
    );
  }

  /**
   * Generate a refresh token for a patient.
   *
   * @param {string} email - The email of the patient.
   * @param {string} username - The username of the patient.
   * @returns {Promise<string>} A promise that resolves to the generated refresh token.
   */
  async getRefreshToken(email: string, username: string): Promise<string> {
    return await this.jwtService.signAsync(
      { email, username },
      {
        expiresIn: parseInt(
          this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
        ),
        secret: this.configService.get('REFRESH_TOKEN_SECRET_CLIENT'),
      },
    );
  }

  /**
   * Update the hash of the refresh token for a patient.
   *
   * @param {string} email - The email of the patient.
   * @param {string} refreshToken - The refresh token to be hashed and updated.
   * @returns {Promise<void>} A promise that resolves when the refresh token is updated.
   */
  async updateRefreshTokenHash(
    email: string,
    refreshToken: string,
  ): Promise<Patient> {
    return await this.patientAuthRepository.findOneAndUpdate(
      { email },
      {
        refreshToken: await bcrypt.hash(
          refreshToken,
          parseInt(`${this.configService.get('CRYPTO_SALT_ROUNDS')}`),
        ),
      },
    );
  }
}
