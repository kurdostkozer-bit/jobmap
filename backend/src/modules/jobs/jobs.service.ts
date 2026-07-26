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
   * @param boundsQuery - Contains bounds, zoom, center, filters
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
    };
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const {
      bounds,
      filters = {},
      limit = 100,
      offset = 0,
    } = boundsQuery;

    const { north, south, east, west } = bounds;

    // Validate bounds
    if (north <= south || east <= west) {
      throw new BadRequestException('Invalid bounds');
    }

    // Build query
    let query = this.jobsRepository.createQueryBuilder('job')
      .where('job.isActive = true')
      .andWhere('job.anonymizedLatitude BETWEEN :south AND :north', { south, north })
      .andWhere('job.anonymizedLongitude BETWEEN :west AND :east', { west, east })
      .leftJoinAndSelect('job.company', 'company')
      .orderBy('job.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

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

    if (filters.salaryMin) {
      query = query.andWhere('job.salaryMax >= :salaryMin', { salaryMin: filters.salaryMin });
    }

    if (filters.salaryMax) {
      query = query.andWhere('job.salaryMin <= :salaryMax', { salaryMax: filters.salaryMax });
    }

    // Get total count for pagination
    const totalQuery = this.jobsRepository.createQueryBuilder('job')
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

    if (filters.salaryMin) {
      totalQuery.andWhere('job.salaryMax >= :salaryMin', { salaryMin: filters.salaryMin });
    }

    if (filters.salaryMax) {
      totalQuery.andWhere('job.salaryMin <= :salaryMax', { salaryMax: filters.salaryMax });
    }

    const total = await totalQuery.getCount();
    const jobs = await query.getMany();

    // Transform jobs to match frontend API spec
    const transformedJobs = jobs.map(job => ({
      id: job.id,
      latitude: parseFloat(job.anonymizedLatitude.toString()),
      longitude: parseFloat(job.anonymizedLongitude.toString()),
      company: job.company?.name || 'Unknown',
      title: job.title,
      salary: `${job.salaryMin || 'N/A'}-${job.salaryMax || 'N/A'}`,
      salaryMin: job.salaryMin ? parseFloat(job.salaryMin.toString()) : null,
      salaryMax: job.salaryMax ? parseFloat(job.salaryMax.toString()) : null,
      employmentType: job.jobType || 'full-time',
      category: job.category || 'Other',
      status: job.isActive ? 'active' : 'inactive',
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      description: job.description,
      skills: job.skills || [],
      applicants: job.applicantsCount || 0,
    }));

    return {
      success: true,
      meta: {
        timestamp: new Date().toISOString(),
        searchArea: { north, south, east, west },
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
