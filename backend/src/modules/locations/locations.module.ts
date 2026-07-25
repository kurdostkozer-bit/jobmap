import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Governorate, District, Neighborhood } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Governorate, District, Neighborhood])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
