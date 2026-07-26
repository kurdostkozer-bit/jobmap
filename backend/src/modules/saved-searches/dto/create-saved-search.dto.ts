import { IsString, IsOptional, IsObject, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateSavedSearchDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  bounds!: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  @IsOptional()
  @IsObject()
  filters?: {
    category?: string[];
    employmentType?: string[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
  };

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsBoolean()
  notifyOnNewJobs?: boolean;

  @IsOptional()
  @IsString()
  notificationFrequency?: string;
}

export class UpdateSavedSearchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  @IsOptional()
  @IsObject()
  filters?: {
    category?: string[];
    employmentType?: string[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
  };

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsBoolean()
  notifyOnNewJobs?: boolean;

  @IsOptional()
  @IsString()
  notificationFrequency?: string;
}
