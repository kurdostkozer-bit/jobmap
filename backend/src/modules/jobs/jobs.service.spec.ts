import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';

describe('JobsService - searchByBounds with Filters', () => {
  let service: JobsService;
  let mockRepository: any;

  const mockJobs = [
    {
      job_id: '1',
      job_anonymizedLatitude: '33.3157',
      job_anonymizedLongitude: '44.3661',
      job_title: 'Senior Developer',
      job_category: 'IT',
      job_jobType: 'full-time',
      job_salaryMin: 5000000,
      job_salaryMax: 8000000,
      job_applicantsCount: 5,
      job_createdAt: new Date('2026-07-25'),
      job_description: 'Senior Developer needed',
    },
    {
      job_id: '2',
      job_anonymizedLatitude: '33.3157',
      job_anonymizedLongitude: '44.3661',
      job_title: 'UI Designer',
      job_category: 'Design',
      job_jobType: 'full-time',
      job_salaryMin: 3000000,
      job_salaryMax: 5000000,
      job_applicantsCount: 3,
      job_createdAt: new Date('2026-07-24'),
      job_description: 'UI Designer for web app',
    },
    {
      job_id: '3',
      job_anonymizedLatitude: '33.3200',
      job_anonymizedLongitude: '44.3700',
      job_title: 'Junior Developer',
      job_category: 'IT',
      job_jobType: 'part-time',
      job_salaryMin: 1500000,
      job_salaryMax: 2500000,
      job_applicantsCount: 10,
      job_createdAt: new Date('2026-07-23'),
      job_description: 'Junior Developer entry level',
    },
  ];

  beforeEach(async () => {
    mockRepository = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should filter jobs by category', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([mockJobs[0]]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await service.searchByBounds({
      bounds: {
        north: 33.4,
        south: 33.2,
        east: 44.4,
        west: 44.3,
      },
      filters: {
        category: ['IT'],
      },
    });

    expect(result.stats.totalFound).toBe(1);
    expect(result.jobs[0].category).toBe('IT');
    expect(result.jobs[0].title).toBe('Senior Developer');
  });

  it('should filter jobs by salary range', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([mockJobs[2]]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await service.searchByBounds({
      bounds: {
        north: 33.4,
        south: 33.2,
        east: 44.4,
        west: 44.3,
      },
      filters: {
        salaryMin: 1000000,
        salaryMax: 3000000,
      },
    });

    expect(result.stats.totalFound).toBe(1);
    expect(result.jobs[0].salaryMin).toBe(1500000);
  });

  it('should apply multiple filters', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([mockJobs[0]]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await service.searchByBounds({
      bounds: {
        north: 33.4,
        south: 33.2,
        east: 44.4,
        west: 44.3,
      },
      filters: {
        category: ['IT'],
        employmentType: ['full-time'],
        salaryMin: 4000000,
      },
    });

    expect(result.stats.totalFound).toBe(1);
    expect(result.jobs[0].employmentType).toBe('full-time');
  });

  it('should validate bounds', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    };

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    try {
      await service.searchByBounds({
        bounds: {
          north: 33.2,
          south: 33.4, // Invalid: south > north
          east: 44.4,
          west: 44.3,
        },
      });
      fail('Should have thrown BadRequestException');
    } catch (error) {
      expect(error.message).toContain('Invalid bounds');
    }
  });
});
