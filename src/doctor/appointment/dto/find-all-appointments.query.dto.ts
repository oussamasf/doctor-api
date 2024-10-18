import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryAppointmentDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Search by username' })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Search by first name' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Search by last name' })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Search by email' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Search by specialization' })
  specialization?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Search by phone number' })
  phoneNumber?: string;
}

export class SortQueryAppointmentDto extends SortQueryCommonDto {
  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by username: 1 for ascending, -1 for descending',
  })
  username?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by first name: 1 for ascending, -1 for descending',
  })
  firstName?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by last name: 1 for ascending, -1 for descending',
  })
  lastName?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by specialization: 1 for ascending, -1 for descending',
  })
  specialization?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by email: 1 for ascending, -1 for descending',
  })
  email?: 1 | -1;
}
