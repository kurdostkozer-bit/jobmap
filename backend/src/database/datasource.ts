import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config();

// Determine environment and adjust paths accordingly
const isProduction = process.env.NODE_ENV === 'production';
const isDist = process.cwd().includes('dist') || process.argv[1]?.includes('dist');

// Use absolute paths that work with ts-node and compiled code
let entitiesPath: any;
let migrationsPath: any;

if (isDist || isProduction) {
  // Compiled mode - dist folder
  entitiesPath = path.join(__dirname, '../modules/**/entities/**/*.entity.js');
  migrationsPath = path.join(__dirname, './**/*.js');
} else {
  // ts-node mode - use glob with src
  const basePath = path.resolve(__dirname, '..');
  entitiesPath = path.join(basePath, 'modules/**/entities/**/*.entity.ts');
  migrationsPath = path.join(__dirname, '*.ts');
}

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
