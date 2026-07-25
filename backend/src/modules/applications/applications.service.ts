import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDTO } from './dto/create-application.dto';
import { NotificationsServiceImpl } from '../notifications/services/notifications.service';
import { NotificationEventTypes } from '@shared/events/index';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private notificationsService: NotificationsServiceImpl,
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

    const savedApplication = await this.applicationsRepository.save(application);

    // Load related data to get job and company info
    const fullApplication = await this.applicationsRepository.findOne({
      where: { id: savedApplication.id },
      relations: ['job', 'job.company', 'user'],
    });

    // Send notification to job's company owner via NotificationsService
    await this.notificationsService.notifyUser(
      fullApplication.job.company.ownerId,
      {
        type: NotificationEventTypes.APPLICATION_SUBMITTED,
        title: 'تقديم طلب جديد',
        message: `${fullApplication.user.firstName} ${fullApplication.user.lastName} تقدم بطلب للوظيفة "${fullApplication.job.title}"`,
        data: {
          applicationId: fullApplication.id,
          jobId: fullApplication.job.id,
          applicantName: `${fullApplication.user.firstName} ${fullApplication.user.lastName}`,
          jobTitle: fullApplication.job.title,
        },
      },
    );

    return savedApplication;
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
    const oldStatus = application.status;
    application.status = status;
    application.reviewedAt = new Date();
    
    const updatedApplication = await this.applicationsRepository.save(application);

    // Send notification to applicant based on status change via NotificationsService
    if (status === 'accepted' && oldStatus !== 'accepted') {
      await this.notificationsService.notifyUser(application.userId, {
        type: NotificationEventTypes.APPLICATION_ACCEPTED,
        title: 'تم قبول طلبك!',
        message: `تم قبول طلبك للوظيفة "${application.job.title}" من قبل ${application.job.company.name}`,
        data: {
          applicationId: application.id,
          jobId: application.job.id,
          companyName: application.job.company.name,
          jobTitle: application.job.title,
        },
      });
    } else if (status === 'rejected' && oldStatus !== 'rejected') {
      await this.notificationsService.notifyUser(application.userId, {
        type: NotificationEventTypes.APPLICATION_REJECTED,
        title: 'للأسف، تم رفض طلبك',
        message: `تم رفض طلبك للوظيفة "${application.job.title}" من قبل ${application.job.company.name}`,
        data: {
          applicationId: application.id,
          jobId: application.job.id,
          companyName: application.job.company.name,
          jobTitle: application.job.title,
        },
      });
    }

    return updatedApplication;
  }

  async withdraw(id: string, userId: string): Promise<void> {
    const application = await this.findById(id);

    if (application.userId !== userId) {
      throw new BadRequestException('You can only withdraw your own applications');
    }

    await this.applicationsRepository.remove(application);
  }
}
