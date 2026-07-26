import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedSearch } from './entities/saved-search.entity';
import { CreateSavedSearchDto, UpdateSavedSearchDto } from './dto/create-saved-search.dto';

@Injectable()
export class SavedSearchesService {
  constructor(
    @InjectRepository(SavedSearch)
    private savedSearchesRepository: Repository<SavedSearch>,
  ) {}

  async create(userId: string, createDto: CreateSavedSearchDto): Promise<SavedSearch> {
    const savedSearch = this.savedSearchesRepository.create({
      ...createDto,
      userId,
    });

    return await this.savedSearchesRepository.save(savedSearch);
  }

  async findById(id: string, userId: string): Promise<SavedSearch> {
    const savedSearch = await this.savedSearchesRepository.findOne({
      where: { id, userId },
    });

    if (!savedSearch) {
      throw new NotFoundException('Saved search not found');
    }

    return savedSearch;
  }

  async findByUserId(userId: string): Promise<SavedSearch[]> {
    return await this.savedSearchesRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateSavedSearchDto,
  ): Promise<SavedSearch> {
    const savedSearch = await this.findById(id, userId);

    Object.assign(savedSearch, updateDto);

    return await this.savedSearchesRepository.save(savedSearch);
  }

  async delete(id: string, userId: string): Promise<void> {
    const savedSearch = await this.findById(id, userId);
    await this.savedSearchesRepository.remove(savedSearch);
  }

  async recordExecution(id: string, userId: string): Promise<void> {
    const savedSearch = await this.findById(id, userId);

    savedSearch.lastExecutedAt = new Date();
    savedSearch.executionCount = (savedSearch.executionCount || 0) + 1;

    await this.savedSearchesRepository.save(savedSearch);
  }

  /**
   * Get all searches that should trigger notifications
   */
  async findNotificationEligibleSearches(frequency: string): Promise<SavedSearch[]> {
    return await this.savedSearchesRepository
      .createQueryBuilder('search')
      .where('search.notifyOnNewJobs = true')
      .andWhere('search.notificationFrequency = :frequency', { frequency })
      .getMany();
  }
}
