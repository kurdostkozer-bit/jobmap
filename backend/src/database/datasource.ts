import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Determine if we're running from source (ts-node) or compiled (dist)
const isProduction = process.env.NODE_ENV === 'production';
const entitiesPath = isProduction 
  ? 'dist/modules/**/entities/**/*.entity.js'
  : 'src/modules/**/entities/**/*.entity.ts';
const migrationsPath = isProduction
  ? 'dist/database/migrations/**/*.js'
  : 'src/database/migrations/**/*.ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'jobmap',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
});
