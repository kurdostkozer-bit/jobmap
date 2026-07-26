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
import { SavedSearchesService } from './saved-searches.service';
import { CreateSavedSearchDto, UpdateSavedSearchDto } from './dto/create-saved-search.dto';
import { SavedSearch } from './entities/saved-search.entity';

@Controller('saved-searches')
export class SavedSearchesController {
  constructor(private savedSearchesService: SavedSearchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: any,
    @Body() createDto: CreateSavedSearchDto,
  ): Promise<SavedSearch> {
    return await this.savedSearchesService.create(req.user.id, createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any): Promise<SavedSearch[]> {
    return await this.savedSearchesService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string, @Request() req: any): Promise<SavedSearch> {
    return await this.savedSearchesService.findById(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateDto: UpdateSavedSearchDto,
  ): Promise<SavedSearch> {
    return await this.savedSearchesService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
    return await this.savedSearchesService.delete(id, req.user.id);
  }

  @Post(':id/execute')
  @UseGuards(JwtAuthGuard)
  async executeSearch(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ success: boolean; message: string }> {
    await this.savedSearchesService.recordExecution(id, req.user.id);
    return { success: true, message: 'Search executed and recorded' };
  }
}
