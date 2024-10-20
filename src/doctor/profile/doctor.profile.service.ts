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
import { DoctorProfileRepository } from './repository/doctor.profile.repository';

// DTOS
import { LoginDto } from './dto';

// Constants
import {
  doctorErrorMessages,
  globalErrorMessages,
} from '../../common/constants/errorMessages';
import { CommonService } from '../../common/common.service';
import { Doctor } from './schemas/doctor.schema';
import { FindAllReturn, LoginRes } from '../../common/types';
import {
  CreateDoctorDto,
  SearchQueryDoctorDto,
  SortQueryDoctorDto,
  UpdateDoctorDto,
} from '../dto';
import { QueryParamsDto } from 'src/common/dto';
import { isPasswordReused } from 'utils/password';

/**
 * Injectable service class for managing doctor authentication.
 * @class
 */
@Injectable()
export class DoctorProfileService {
  /**
   * Constructor for the DoctorAccountService class.
   *
   * @constructor
   * @param {DoctorAccountRepository} private readonly doctorAccountRepository - The doctor repository.
   * @param {JwtService} private readonly jwtService - The JWT service for token generation.
   * @param {CommonService} private readonly commonService - The common service for utility functions.
   * @param {ConfigService} private readonly configService - The configuration service.
   */
  constructor(
    private readonly doctorProfileRepository: DoctorProfileRepository,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Find a doctor by ID.
   *
   * @param {string} _id - The ID of the doctor to find.
   * @returns {Promise<Doctor>} A promise that resolves to the found doctor.
   */
  findOne(
    _id: string, //:  Promise<User>
  ) {
    return this.doctorProfileRepository.findOne({ _id });
  }

  /**
   * Find a doctor by email.
   *
   * @param {string} email - The email of the doctor to find.
   * @returns {Promise<Doctor>} A promise that resolves to the found doctor.
   */
  async getUserByName(username: string) {
    return await this.doctorProfileRepository.findOne({ username });
  }

  /**
   * Log in a doctor.
   *
   * @param {LoginDto} loginDto - The login DTO containing email and password.
   * @returns {Promise<LoginRes<Doctor>>} A promise that resolves to the login response including tokens and user information.
   */
  async login(loginDto: LoginDto): Promise<LoginRes<Doctor>> {
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
   * Log out a doctor by removing the refresh token.
   *
   * @param {string} email - The email of the doctor to log out.
   * @returns {Promise<void>} A promise that resolves when the doctor is logged out.
   */
  async logout(email: string) {
    return await this.doctorProfileRepository.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1 } },
    );
  }

  /**
   * Refresh the access token for a doctor.
   *
   * @param {Doctor} user - The doctor user for whom to refresh the access token.
   * @returns {Promise<{ access_token: string }>} A promise that resolves to the new access token.
   */
  async refresh(user: Doctor) {
    const access_token = await this.getAccessToken(user.email, user.username);
    return { access_token };
  }

  /**
   * Generate an access token for a doctor.
   *
   * @param {string} email - The email of the doctor.
   * @param {string} username - The username of the doctor.
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
   * Generate a refresh token for a doctor.
   *
   * @param {string} email - The email of the doctor.
   * @param {string} username - The username of the doctor.
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
   * Update the hash of the refresh token for a doctor.
   *
   * @param {string} email - The email of the doctor.
   * @param {string} refreshToken - The refresh token to be hashed and updated.
   * @returns {Promise<void>} A promise that resolves when the refresh token is updated.
   */
  async updateRefreshTokenHash(
    email: string,
    refreshToken: string,
  ): Promise<Doctor> {
    return await this.doctorProfileRepository.findOneAndUpdate(
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
   * Retrieves a list of doctor information entries based on specified query parameters.
   *
   * @param {QueryParamsDto} query - The query parameters for pagination (e.g., limit, skip).
   * @param {SearchQueryMovieDto} search - The search criteria to filter agencies (optional).
   * @param {SortQueryMovieDto} sort - The sorting criteria for the result (optional).
   * @returns {Promise<FindAllReturn<Movie>>} A Promise that resolves to a paginated list of doctor information entries.
   */
  async findAll(
    query: QueryParamsDto,
    search: SearchQueryDoctorDto,
    sort: SortQueryDoctorDto,
  ): Promise<FindAllReturn<Doctor>> {
    const { limit, skip } = query;

    const findQuery = { limit, skip, search, sort };

    return await this.doctorProfileRepository.find(findQuery);
  }

  /**
   * Creates a new doctor information entry based on the provided DTO.
   *
   * @param {CreateMovieDto} createMovieDto - The DTO containing  information for creation.
   * @throws {ConflictException} If an doctor with the same name already exists.
   * @returns {Promise<MovieInformation>} A Promise that resolves to the created doctor information.
   */
  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.doctorProfileRepository.create(createDoctorDto);
  }

  /**
   * Retrieves a single doctor information entry by its unique id (_idNumber) and throws a "Not Found" exception if not found.
   *
   * @param {string} _id - The unique id of the doctor information entry to find.
   * @throws {NotFoundException} If no doctor with the specified _idNumber is found.
   * @returns {Promise<Movie>} A Promise that resolves to the found doctor information entry.
   */
  async findOneWithException(_id: string): Promise<Doctor | void> {
    return await this.commonService.findWithNotFoundException(
      () => this.findOne(_id),
      doctorErrorMessages.DOCTOR_NOT_FOUND,
    );
  }

  /**
   * Updates an doctor information entry with the specified changes based on its unique id (idNumber).
   *
   * @param {string} id - The unique id of the doctor information entry to update.
   * @param {UpdateMovieDto} updateMovieDto - The data containing the changes to apply to the doctor information entry.
   * @throws {DuplicatedMongoException} If the proposed changes result in a duplicate doctor name.
   * @returns {Promise<Movie>} A Promise that resolves when the doctor information entry is successfully updated.
   */
  async update(id: string, updateMovieDto: UpdateDoctorDto): Promise<Doctor> {
    return await this.commonService.duplicatedMongo(
      () => this.doctorProfileRepository.updateById(id, updateMovieDto),
      '<PLACEHOLDER>',
    );
  }

  /**
   * Deletes a doctor information entry based on its unique id (_idNumber).
   *
   * @param {string} _id - The unique id of the doctor information entry to delete.
   * @returns {Promise<void>} A Promise that resolves when the doctor information entry is successfully deleted.
   */
  async delete(_id: string): Promise<Doctor> {
    return await this.doctorProfileRepository.deleteById(_id);
  }

  /**
   * Resets the password for a doctor by updating the password hash in the database.
   *
   * @param email - The email of the doctor for whom the password is being reset.
   * @param password - The new password for the doctor.
   * @param userId - The unique identifier of the doctor requesting the password reset.
   * @returns A promise that resolves to the updated doctor object with the new password.
   */
  async resetPassword(
    email: string,
    password: string,
    userId: string,
  ): Promise<Doctor> {
    const user = (await this.doctorProfileRepository.findOne({
      email,
    })) as Doctor & {
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

    return await this.doctorProfileRepository.findOneAndUpdate(
      { email },
      { password: hashedPassword },
    );
  }
}
