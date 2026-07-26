import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { SearchBoundsDto } from './dto/search-bounds.dto';
import { Job } from './entities/job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: any,
    @Body() createJobDTO: CreateJobDTO,
  ): Promise<Job> {
    return await this.jobsService.create(req.user.companyId, createJobDTO);
  }

  // Static routes BEFORE :id parameter
  @Post('search/bounds')
  async searchByBounds(@Body() boundsQuery: SearchBoundsDto): Promise<any> {
    try {
      return await this.jobsService.searchByBounds(boundsQuery);
    } catch (error) {
      console.error('Error in searchByBounds:', error);
      throw error;
    }
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('governorate') governorate?: string,
    @Query('salaryMin') salaryMin?: number,
    @Query('salaryMax') salaryMax?: number,
  ): Promise<Job[]> {
    return await this.jobsService.search(query, governorate, salaryMin, salaryMax);
  }

  @Get('location/nearby')
  async findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number = 50,
  ): Promise<Job[]> {
    return await this.jobsService.findByLocation(lat, lng, radius);
  }

  @Get('company/:companyId')
  async findByCompany(@Param('companyId') companyId: string): Promise<Job[]> {
    return await this.jobsService.findByCompanyId(companyId);
  }

  @Get('governorate/:governorate')
  async findByGovernorate(@Param('governorate') governorate: string): Promise<Job[]> {
    return await this.jobsService.findByGovernorate(governorate);
  }

  // Dynamic :id route LAST
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Job> {
    return await this.jobsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateData: Partial<CreateJobDTO>,
  ): Promise<Job> {
    return await this.jobsService.update(id, req.user.companyId, updateData);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
    return await this.jobsService.delete(id, req.user.companyId);
  }
}
