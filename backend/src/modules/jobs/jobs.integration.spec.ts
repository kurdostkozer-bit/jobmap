import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import * as request from 'supertest';
import { JobsModule } from './jobs.module';
import { Job } from './entities/job.entity';

describe('JobsController - P3 Discovery Integration Tests (e2e)', () => {
  let app: INestApplication;
  let jobsRepository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Job],
          synchronize: true,
        }),
        JobsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jobsRepository = getConnection().getRepository(Job);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /jobs/search/bounds - Discovery Engine', () => {
    it('should filter jobs by category', async () => {
      // Seed test data
      const job1 = jobsRepository.create({
        companyId: 'test-company',
        title: 'Senior Developer',
        description: 'TypeScript developer',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Senior',
        salaryMin: 5000000,
        salaryMax: 8000000,
        governorate: 'Baghdad',
        realLatitude: 33.3156,
        realLongitude: 44.3661,
        anonymizedLatitude: 33.3156,
        anonymizedLongitude: 44.3661,
        isActive: true,
      });

      const job2 = jobsRepository.create({
        companyId: 'test-company',
        title: 'UI Designer',
        description: 'Figma expert',
        category: 'Design',
        jobType: 'Full-Time',
        experienceLevel: 'Mid',
        salaryMin: 3000000,
        salaryMax: 5000000,
        governorate: 'Baghdad',
        realLatitude: 33.3140,
        realLongitude: 44.3680,
        anonymizedLatitude: 33.3140,
        anonymizedLongitude: 44.3680,
        isActive: true,
      });

      await jobsRepository.save([job1, job2]);

      const response = await request(app.getHttpServer())
        .post('/jobs/search/bounds')
        .send({
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

      expect(response.status).toBe(200);
      expect(response.body.stats.totalFound).toBe(1);
      expect(response.body.jobs[0].category).toBe('IT');
    });

    it('should apply salary range filter', async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs/search/bounds')
        .send({
          bounds: {
            north: 33.4,
            south: 33.2,
            east: 44.4,
            west: 44.3,
          },
          filters: {
            salaryMin: 2000000,
            salaryMax: 4000000,
          },
        });

      expect(response.status).toBe(200);
      // Only Design job falls in this range
      expect(response.body.stats.totalFound).toBeLessThanOrEqual(1);
    });

    it('should sort by salary descending', async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs/search/bounds')
        .send({
          bounds: {
            north: 33.4,
            south: 33.2,
            east: 44.4,
            west: 44.3,
          },
          sortBy: 'salary-desc',
        });

      expect(response.status).toBe(200);
      expect(response.body.meta.sortBy).toBe('salary-desc');
      
      if (response.body.jobs.length > 1) {
        const salaries = response.body.jobs.map((j) => j.salaryMax);
        for (let i = 1; i < salaries.length; i++) {
          expect(salaries[i - 1]).toBeGreaterThanOrEqual(salaries[i]);
        }
      }
    });

    it('should validate invalid bounds', async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs/search/bounds')
        .send({
          bounds: {
            north: 33.2,
            south: 33.4, // Invalid: south > north
            east: 44.4,
            west: 44.3,
          },
        });

      expect(response.status).toBe(400);
    });

    it('should include pagination metadata', async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs/search/bounds')
        .send({
          bounds: {
            north: 33.4,
            south: 33.2,
            east: 44.4,
            west: 44.3,
          },
          limit: 10,
          offset: 0,
        });

      expect(response.status).toBe(200);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.offset).toBe(0);
      expect(response.body.pagination.total).toBeDefined();
      expect(response.body.pagination.hasMore).toBeDefined();
    });

    it('should return success metadata', async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs/search/bounds')
        .send({
          bounds: {
            north: 33.4,
            south: 33.2,
            east: 44.4,
            west: 44.3,
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.timestamp).toBeDefined();
      expect(response.body.meta.searchArea).toBeDefined();
      expect(response.body.stats).toBeDefined();
    });
  });
});
