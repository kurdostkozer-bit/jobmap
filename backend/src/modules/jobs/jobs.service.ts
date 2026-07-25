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
}
