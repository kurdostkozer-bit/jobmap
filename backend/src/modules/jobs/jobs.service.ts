import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDTO } from './dto/create-job.dto';
import { anonymizeCoordinates } from '../../common/services/location-anonymizer.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(companyId: string, createJobDTO: CreateJobDTO): Promise<Job> {
    const { realLatitude, realLongitude, governorate, district } = createJobDTO;

    // Anonymize coordinates for privacy
    const { lat, lng } = anonymizeCoordinates(
      realLatitude,
      realLongitude,
      district || governorate,
    );

    const job = this.jobsRepository.create({
      ...createJobDTO,
      companyId,
      anonymizedLatitude: lat,
      anonymizedLongitude: lng,
    });

    return await this.jobsRepository.save(job);
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async findByCompanyId(companyId: string): Promise<Job[]> {
    return await this.jobsRepository.find({
      where: { companyId, isActive: true },
      relations: ['company'],
    });
  }

  async findByGovernorate(governorate: string): Promise<Job[]> {
    return await this.jobsRepository.find({
      where: { governorate, isActive: true },
      relations: ['company'],
    });
  }

  async findByLocation(lat: number, lng: number, radiusKm: number = 50): Promise<Job[]> {
    // PostGIS query for proximity search
    const query = this.jobsRepository.createQueryBuilder('job')
      .where(
        `st_distance_sphere(
          st_point(job.anonymizedLongitude, job.anonymizedLatitude),
          st_point(:lng, :lat)
        ) <= :radius * 1000`,
        { lat, lng, radius: radiusKm }
      )
      .andWhere('job.isActive = true')
      .leftJoinAndSelect('job.company', 'company');

    return await query.getMany();
  }

  async search(
    query: string,
    governorate?: string,
    salaryMin?: number,
    salaryMax?: number,
  ): Promise<Job[]> {
    let queryBuilder = this.jobsRepository.createQueryBuilder('job')
      .where('job.isActive = true')
      .andWhere('(job.title ILIKE :query OR job.description ILIKE :query)', {
        query: `%${query}%`,
      })
      .leftJoinAndSelect('job.company', 'company');

    if (governorate) {
      queryBuilder = queryBuilder.andWhere('job.governorate = :governorate', { governorate });
    }

    if (salaryMin) {
      queryBuilder = queryBuilder.andWhere('job.salaryMax >= :salaryMin', { salaryMin });
    }

    if (salaryMax) {
      queryBuilder = queryBuilder.andWhere('job.salaryMin <= :salaryMax', { salaryMax });
    }

    return await queryBuilder.orderBy('job.createdAt', 'DESC').getMany();
  }

  async update(id: string, companyId: string, updateData: Partial<CreateJobDTO>): Promise<Job> {
    const job = await this.findById(id);

    if (job.companyId !== companyId) {
      throw new BadRequestException('You can only update your own jobs');
    }

    if (updateData.realLatitude && updateData.realLongitude) {
      const { lat, lng } = anonymizeCoordinates(
        updateData.realLatitude,
        updateData.realLongitude,
        updateData.district || job.district || job.governorate,
      );
      (updateData as any)['anonymizedLatitude'] = lat;
      (updateData as any)['anonymizedLongitude'] = lng;
    }

    Object.assign(job, updateData);
    return await this.jobsRepository.save(job);
  }

  async delete(id: string, companyId: string): Promise<void> {
    const job = await this.findById(id);

    if (job.companyId !== companyId) {
      throw new BadRequestException('You can only delete your own jobs');
    }

    await this.jobsRepository.remove(job);
  }

  async incrementApplicants(jobId: string): Promise<void> {
    await this.jobsRepository.update(jobId, {
      applicantsCount: () => 'applicantsCount + 1',
    });
  }

  /**
   * Search jobs within geographic bounds (Map Core Engine)
   * 
   * OPTIMIZED: 
   * - Removed company join (not needed for map display)
   * - Selected only required fields
   * - Default limit 50 instead of 100 (reduces payload size)
   * - Supports multi-field sorting (relevance, salary, date, distance)
   * 
   * @param boundsQuery - Contains bounds, zoom, center, filters, sortBy
   * @returns Jobs within bounds + metadata
   */
  async searchByBounds(boundsQuery: {
    bounds: { north: number; south: number; east: number; west: number };
    zoom?: number;
    center?: { lat: number; lng: number };
    filters?: {
      employmentType?: string[];
      category?: string[];
      salaryMin?: number;
      salaryMax?: number;
      status?: string[];
      experienceLevel?: string[];
    };
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const {
      bounds,
      filters = {},
      sortBy = 'relevance',
      limit = 50,
      offset = 0,
    } = boundsQuery;

    const { north, south, east, west } = bounds;

    console.log('🔍 Search bounds request:', { north, south, east, west, filters, sortBy });

    // Validate bounds
    if (north <= south || east <= west) {
      const errorMsg = `Invalid bounds: north(${north}) must be > south(${south}), east(${east}) must be > west(${west})`;
      console.error('❌ ' + errorMsg);
      throw new BadRequestException(errorMsg);
    }

    // Build optimized query with company join
    let query = this.jobsRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .select([
        'job.id',
        'job.anonymizedLatitude',
        'job.anonymizedLongitude',
        'job.title',
        'job.category',
        'job.jobType',
        'job.salaryMin',
        'job.salaryMax',
        'job.applicantsCount',
        'job.createdAt',
        'job.description',
        'job.experienceLevel',
        'company.name',
        'company.id',
      ])
      .where('job.isActive = true')
      .andWhere('job.anonymizedLatitude BETWEEN :south AND :north', { south, north })
      .andWhere('job.anonymizedLongitude BETWEEN :west AND :east', { west, east });

    // Apply filters if provided
    if (filters.employmentType && filters.employmentType.length > 0) {
      query = query.andWhere('job.jobType IN (:...employmentTypes)', {
        employmentTypes: filters.employmentType,
      });
    }

    if (filters.category && filters.category.length > 0) {
      query = query.andWhere('job.category IN (:...categories)', {
        categories: filters.category,
      });
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      query = query.andWhere('job.experienceLevel IN (:...levels)', {
        levels: filters.experienceLevel,
      });
    }

    if (filters.salaryMin) {
      query = query.andWhere('job.salaryMax >= :salaryMin', { salaryMin: filters.salaryMin });
    }

    if (filters.salaryMax) {
      query = query.andWhere('job.salaryMin <= :salaryMax', { salaryMax: filters.salaryMax });
    }

    // Apply sorting
    switch (sortBy) {
      case 'salary-asc':
        query = query.orderBy('job.salaryMin', 'ASC').addOrderBy('job.createdAt', 'DESC');
        break;
      case 'salary-desc':
        query = query.orderBy('job.salaryMax', 'DESC').addOrderBy('job.createdAt', 'DESC');
        break;
      case 'date':
        query = query.orderBy('job.createdAt', 'DESC');
        break;
      case 'distance':
        // Distance sorting requires center point (already in bounds query)
        // For now, default to relevance (createdAt DESC + applicants DESC)
        query = query.orderBy('job.createdAt', 'DESC').addOrderBy('job.applicantsCount', 'DESC');
        break;
      case 'relevance':
      default:
        // Relevance: combination of recency and popularity
        query = query.orderBy('job.createdAt', 'DESC').addOrderBy('job.applicantsCount', 'DESC');
    }

    query = query.skip(offset).take(limit);

    // Get total count for pagination (lightweight query)
    let totalQuery = this.jobsRepository.createQueryBuilder('job')
      .where('job.isActive = true')
      .andWhere('job.anonymizedLatitude BETWEEN :south AND :north', { south, north })
      .andWhere('job.anonymizedLongitude BETWEEN :west AND :east', { west, east });

    if (filters.employmentType && filters.employmentType.length > 0) {
      totalQuery.andWhere('job.jobType IN (:...employmentTypes)', {
        employmentTypes: filters.employmentType,
      });
    }

    if (filters.category && filters.category.length > 0) {
      totalQuery.andWhere('job.category IN (:...categories)', {
        categories: filters.category,
      });
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      totalQuery.andWhere('job.experienceLevel IN (:...levels)', {
        levels: filters.experienceLevel,
      });
    }

    if (filters.salaryMin) {
      totalQuery.andWhere('job.salaryMax >= :salaryMin', { salaryMin: filters.salaryMin });
    }

    if (filters.salaryMax) {
      totalQuery.andWhere('job.salaryMin <= :salaryMax', { salaryMax: filters.salaryMax });
    }

    // Execute both queries in parallel for better performance
    const [jobs, total] = await Promise.all([
      query.getRawMany(),
      totalQuery.getCount(),
    ]);

    // Transform jobs to match frontend API spec
    const transformedJobs = jobs.map(job => ({
      id: job.id,
      latitude: parseFloat(job.anonymizedLatitude),
      longitude: parseFloat(job.anonymizedLongitude),
      title: job.title,
      company: job.company?.name || 'Unknown Company',
      salary: `${job.salaryMin || 'N/A'}-${job.salaryMax || 'N/A'}`,
      salaryMin: job.salaryMin ? parseFloat(job.salaryMin) : null,
      salaryMax: job.salaryMax ? parseFloat(job.salaryMax) : null,
      employmentType: job.jobType || 'Full-Time',
      category: job.category || 'Other',
      experienceLevel: job.experienceLevel || 'Entry',
      status: 'active',
      createdAt: job.createdAt?.toISOString?.() || new Date().toISOString(),
      description: job.description,
      applicants: job.applicantsCount || 0,
    }));

    return {
      success: true,
      meta: {
        timestamp: new Date().toISOString(),
        searchArea: { north, south, east, west },
        sortBy,
      },
      stats: {
        totalFound: total,
        returnedCount: jobs.length,
        filteredOut: total - jobs.length,
      },
      jobs: transformedJobs,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    };
  }
}
