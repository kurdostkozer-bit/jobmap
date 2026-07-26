import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Import entities directly to ensure TypeORM can find them
import { User } from '../modules/users/entities/user.entity';
import { Company } from '../modules/companies/entities/company.entity';
import { Job } from '../modules/jobs/entities/job.entity';
import { SavedSearch } from '../modules/saved-searches/entities/saved-search.entity';
import { Application } from '../modules/applications/entities/application.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';

// Import migrations
import { CreateUsersTable1721903400000 } from './migrations/1721903400000-CreateUsersTable';
import { CreateSavedSearchesTable1726000001000 } from './migrations/1726000001000-CreateSavedSearchesTable';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: [User, Company, Job, SavedSearch, Application, Notification],
  migrations: [
    CreateUsersTable1721903400000,
    CreateSavedSearchesTable1726000001000,
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
});
