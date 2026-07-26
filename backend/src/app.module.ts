import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SavedSearchesModule } from './modules/saved-searches/saved-searches.module';

// Import entities directly
import { User } from './modules/users/entities/user.entity';
import { Company } from './modules/companies/entities/company.entity';
import { Job } from './modules/jobs/entities/job.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { Application } from './modules/applications/entities/application.entity';
import { Governorate, District, Neighborhood } from './modules/locations/entities/location.entity';
import { SavedSearch } from './modules/saved-searches/entities/saved-search.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'jobmap',
      entities: [
        User,
        Company,
        Job,
        Notification,
        Application,
        Governorate,
        District,
        Neighborhood,
        SavedSearch,
      ],
      migrations: [
        'dist/database/migrations/**/*.js',
      ],
      synchronize: true,
      logging: process.env.DB_LOGGING === 'true',
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    JobsModule,
    LocationsModule,
    ApplicationsModule,
    NotificationsModule,
    SavedSearchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
