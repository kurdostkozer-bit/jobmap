import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const isProduction = process.env.NODE_ENV === 'production';

// Create a dedicated DataSource for setup scripts (only for development)
export const setupDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: isProduction 
    ? ['dist/modules/**/entities/**/*.entity.js']
    : ['src/modules/**/entities/**/*.entity.ts'],
  synchronize: false,
  logging: !isProduction,
});

// Main AppDataSource for NestJS (uses glob patterns or compiled files)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: isProduction 
    ? ['dist/modules/**/entities/**/*.entity.js']
    : ['src/modules/**/entities/**/*.entity.ts'],
  migrations: isProduction
    ? ['dist/database/migrations/**/*.js']
    : ['src/database/migrations/**/*.ts'],
  synchronize: false,
  logging: !isProduction,
  migrationsRun: false,
});
