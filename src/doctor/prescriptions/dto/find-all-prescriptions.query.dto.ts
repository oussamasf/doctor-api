import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsIn,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryPrescriptionDto {
  @IsOptional()
  @IsMongoId()
  readonly patientId?: string;

  @IsOptional()
  @IsMongoId()
  readonly doctorId?: string;

  @IsOptional()
  @IsString()
  readonly medication?: string;

  @IsOptional()
  @IsDateString()
  readonly startDate?: string;

  @IsOptional()
  @IsDateString()
  readonly endDate?: string;
}

export class SortQueryPrescriptionDto extends SortQueryCommonDto {
  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by startDate: 1 for ascending, -1 for descending',
  })
  startDate?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by endDate: 1 for ascending, -1 for descending',
  })
  endDate?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by patientId: 1 for ascending, -1 for descending',
  })
  patientId?: 1 | -1;
}
