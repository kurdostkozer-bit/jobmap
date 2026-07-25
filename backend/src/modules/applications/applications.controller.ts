import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDTO } from './dto/create-application.dto';
import { Application } from './entities/application.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: any,
    @Body() createApplicationDTO: CreateApplicationDTO,
  ): Promise<Application> {
    return await this.applicationsService.create(req.user.id, createApplicationDTO);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Application> {
    return await this.applicationsService.findById(id);
  }

  @Get('user/my-applications')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Request() req: any): Promise<Application[]> {
    return await this.applicationsService.findByUserId(req.user.id);
  }

  @Get('job/:jobId')
  async findByJob(@Param('jobId') jobId: string): Promise<Application[]> {
    return await this.applicationsService.findByJobId(jobId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Application> {
    return await this.applicationsService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async withdraw(@Param('id') id: string, @Request() req: any): Promise<void> {
    return await this.applicationsService.withdraw(id, req.user.id);
  }
}
