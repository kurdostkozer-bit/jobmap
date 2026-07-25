import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: any,
    @Body() createCompanyDTO: CreateCompanyDTO,
  ): Promise<Company> {
    return await this.companiesService.create(req.user.id, createCompanyDTO);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Company> {
    return await this.companiesService.findById(id);
  }

  @Get()
  async findByGovernorate(@Param('governorate') governorate: string): Promise<Company[]> {
    return await this.companiesService.findByGovernorate(governorate);
  }

  @Get('my-companies')
  @UseGuards(JwtAuthGuard)
  async findByOwner(@Request() req: any): Promise<Company[]> {
    return await this.companiesService.findByOwnerId(req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateData: Partial<CreateCompanyDTO>,
  ): Promise<Company> {
    return await this.companiesService.update(id, req.user.id, updateData);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
    return await this.companiesService.delete(id, req.user.id);
  }
}
