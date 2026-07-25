import { IsString, IsOptional, IsNumber, IsArray, IsLatitude, IsLongitude } from 'class-validator';

export class CreateJobDTO {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsString()
  governorate!: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsLatitude()
  realLatitude!: number;

  @IsLongitude()
  realLongitude!: number;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  languages?: string[];

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;
}
