import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDTO } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async create(userId: string, createApplicationDTO: CreateApplicationDTO): Promise<Application> {
    const existingApplication = await this.applicationsRepository.findOne({
      where: { userId, jobId: createApplicationDTO.jobId },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = this.applicationsRepository.create({
      ...createApplicationDTO,
      userId,
    });

    return await this.applicationsRepository.save(application);
  }

  async findById(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['user', 'job', 'job.company'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async findByUserId(userId: string): Promise<Application[]> {
    return await this.applicationsRepository.find({
      where: { userId },
      relations: ['job', 'job.company'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findByJobId(jobId: string): Promise<Application[]> {
    return await this.applicationsRepository.find({
      where: { jobId },
      relations: ['user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string): Promise<Application> {
    const application = await this.findById(id);
    application.status = status;
    application.reviewedAt = new Date();
    return await this.applicationsRepository.save(application);
  }

  async withdraw(id: string, userId: string): Promise<void> {
    const application = await this.findById(id);

    if (application.userId !== userId) {
      throw new BadRequestException('You can only withdraw your own applications');
    }

    await this.applicationsRepository.remove(application);
  }
}
