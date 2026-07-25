import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: ['dist/modules/**/entities/**/*.entity.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
});
