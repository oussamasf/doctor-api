import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
// DB actor
import { PatientProfileRepository } from './repository/patient.profile.repository';

// DTOS
import { LoginDto } from './dto';

// Constants
import {
  globalErrorMessages,
  patientErrorMessages,
} from '../../common/constants/errorMessages';
import { CommonService } from '../../common/common.service';
import { Patient } from './schemas/patient.schema';
import { FindAllReturn, LoginRes } from '../../common/types';
import { QueryParamsDto } from 'src/common/dto';
import {
  CreatePatientDto,
  SearchQueryPatientDto,
  SortQueryPatientDto,
  UpdatePatientDto,
} from 'src/patient/dto';
import { isPasswordReused } from 'utils/password';

/**
 * Injectable service class for managing patient authentication.
 * @class
 */
@Injectable()
export class PatientProfileService {
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
    private readonly patientProfileRepository: PatientProfileRepository,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates a new patient information entry based on the provided DTO.
   *
   * @param {CreateMovieDto} createMovieDto - The DTO containing  information for creation.
   * @throws {ConflictException} If an patient with the same name already exists.
   * @returns {Promise<MovieInformation>} A Promise that resolves to the created patient information.
   */
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    await this.commonService.findWithConflictException(
      () => this.getUserByName(createPatientDto.username),
      patientErrorMessages.PATIENT_ALREADY_EXISTS,
    );
    return await this.patientProfileRepository.create(createPatientDto);
  }

  /**
   * Find a patient by ID.
   *
   * @param {string} _id - The ID of the patient to find.
   * @returns {Promise<Patient>} A promise that resolves to the found patient.
   */
  findOne(_id: string): Promise<Patient> {
    return this.patientProfileRepository.findOne({ _id });
  }

  fetchPatientInfo(_id: string): Promise<Patient> {
    return this.patientProfileRepository.findOneAndPopulate({ _id });
  }

  /**
   * Find a patient by email.
   *
   * @param {string} email - The email of the patient to find.
   * @returns {Promise<Patient>} A promise that resolves to the found patient.
   */
  async getUserByName(username: string) {
    return await this.patientProfileRepository.findOne({ username });
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
    return await this.patientProfileRepository.findOneAndUpdate(
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
    return await this.patientProfileRepository.findOneAndUpdate(
      { email },
      {
        refreshToken: await bcrypt.hash(
          refreshToken,
          parseInt(`${this.configService.get('CRYPTO_SALT_ROUNDS')}`),
        ),
      },
    );
  }

  /**
   * Retrieves a list of patient information entries based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryMovieDto} search - The search criteria to filter agencies (optional).
   * @param {SortQueryMovieDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<Movie>>} A Promise that resolves to a paginated list of patient information entries.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryPatientDto,
    sort: SortQueryPatientDto,
  ): Promise<FindAllReturn<Patient>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.patientProfileRepository.find(findQuery);
  }

  /**
   * Retrieves a single patient information entry by its unique id (_idNumber) and throws a "Not Found" exception if not found.
   *
   * @param {string} _id - The unique id of the patient information entry to find.
   * @throws {NotFoundException} If no patient with the specified _idNumber is found.
   * @returns {Promise<Movie>} A Promise that resolves to the found patient information entry.
   */
  async findOneWithException(_id: string): Promise<Patient | void> {
    return await this.commonService.findWithNotFoundException(
      () => this.fetchPatientInfo(_id),
      patientErrorMessages.PATIENT_NOT_FOUND,
    );
  }

  /**
   * Updates an patient information entry with the specified changes based on its unique id (idNumber).
   *
   * @param {string} id - The unique id of the patient information entry to update.
   * @param {UpdateMovieDto} updateMovieDto - The data containing the changes to apply to the patient information entry.
   * @throws {DuplicatedMongoException} If the proposed changes result in a duplicate patient name.
   * @returns {Promise<Movie>} A Promise that resolves when the patient information entry is successfully updated.
   */
  async update(id: string, updateMovieDto: UpdatePatientDto): Promise<Patient> {
    return await this.commonService.duplicatedMongo(
      () => this.patientProfileRepository.updateById(id, updateMovieDto),
      '<PLACEHOLDER>',
    );
  }

  /**
   * Deletes a patient information entry based on its unique id (_idNumber).
   *
   * @param {string} _id - The unique id of the patient information entry to delete.
   * @returns {Promise<void>} A Promise that resolves when the patient information entry is successfully deleted.
   */
  async delete(_id: string): Promise<Patient> {
    return await this.patientProfileRepository.deleteById(_id);
  }

  /**
   * Resets the password for a patient by updating the password hash in the database.
   *
   * @param email - The email of the patient for whom the password is being reset.
   * @param password - The new password for the patient.
   * @param userId - The unique identifier of the patient requesting the password reset.
   * @returns A promise that resolves to the updated patient object with the new password.
   */
  async resetPassword(
    email: string,
    password: string,
    userId: string,
  ): Promise<Patient> {
    const user = (await this.patientProfileRepository.findOne({
      email,
    })) as Patient & {
      _id: Types.ObjectId;
    };
    if (!user || user._id.toString() !== userId)
      throw new NotFoundException(
        globalErrorMessages.YOU_ARE_NOT_AUTHORIZED_TO_PERFORM_THIS_ACTION,
      );

    const isUsedPassword = await isPasswordReused(password, user.password);

    if (isUsedPassword) {
      throw new BadRequestException(
        globalErrorMessages.PASSWORD_HAS_BEEN_USED_RECENTLY,
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(`${this.configService.get('CRYPTO_SALT_ROUNDS')}`),
    );

    return await this.patientProfileRepository.findOneAndUpdate(
      { email },
      { password: hashedPassword },
    );
  }
}
