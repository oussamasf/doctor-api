import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsIn, IsMongoId } from 'class-validator';
import { SortQueryCommonDto } from 'src/common/dto/query-params.dto';

export class SearchQueryMedicalHistoryDto {
  @IsOptional()
  @IsMongoId()
  readonly patientId?: string;

  @IsOptional()
  @IsMongoId()
  readonly doctorId?: string;

  @IsOptional()
  @IsString()
  readonly diagnosis?: string;

  @IsOptional()
  @IsString()
  readonly treatment?: string;
}

export class SortQueryMedicalHistoryDto extends SortQueryCommonDto {
  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by patientId: 1 for ascending, -1 for descending',
  })
  patientId?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by doctorId: 1 for ascending, -1 for descending',
  })
  doctorId?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by diagnosis: 1 for ascending, -1 for descending',
  })
  diagnosis?: 1 | -1;

  @IsIn([1, -1])
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    required: false,
    enum: [1, -1],
    description: 'Sort by treatment: 1 for ascending, -1 for descending',
  })
  treatment?: 1 | -1;
}
