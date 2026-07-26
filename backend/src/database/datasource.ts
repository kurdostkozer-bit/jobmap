import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Company } from '../modules/companies/entities/company.entity';
import { Job } from '../modules/jobs/entities/job.entity';
import { SavedSearch } from '../modules/saved-searches/entities/saved-search.entity';
import { Application } from '../modules/applications/entities/application.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';

config();

// Create a dedicated DataSource for setup scripts
export const setupDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: [User, Company, Job, SavedSearch, Application, Notification],
  migrations: ['src/database/migrations/**/*.ts', 'dist/database/migrations/**/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
});

// Main AppDataSource for NestJS (uses glob patterns or compiled files)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: ['src/modules/**/entities/**/*.entity.ts', 'dist/modules/**/entities/**/*.entity.js'],
  migrations: ['src/database/migrations/**/*.ts', 'dist/database/migrations/**/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
});
