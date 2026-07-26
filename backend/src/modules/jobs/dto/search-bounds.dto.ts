import { IsNumber, IsOptional, IsArray, IsString, Min, Max } from 'class-validator';

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

export class SearchBoundsDto {
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  zoom?: number;

  bounds: BoundsDto;

  @IsOptional()
  center?: {
    lat: number;
    lng: number;
  };

  @IsOptional()
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
