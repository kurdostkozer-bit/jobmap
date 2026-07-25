import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDTO {
  @IsUUID()
  jobId!: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;
}
