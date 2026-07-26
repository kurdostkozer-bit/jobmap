import { IsNumber, IsOptional, IsArray, IsString, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BoundsDto {
  @IsNumber()
  north: number;

  @IsNumber()
  south: number;

  @IsNumber()
  east: number;

  @IsNumber()
  west: number;
}

export class FiltersDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employmentType?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  status?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  experienceLevel?: string[];
}

export class CenterDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class SearchBoundsDto {
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  zoom?: number;

  @ValidateNested()
  @Type(() => BoundsDto)
  bounds: BoundsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CenterDto)
  center?: CenterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FiltersDto)
  filters?: FiltersDto;

  @IsOptional()
  @IsString()
  sortBy?: string; // relevance, salary-asc, salary-desc, date, distance

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}
