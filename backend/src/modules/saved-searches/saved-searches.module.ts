import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedSearch } from './entities/saved-search.entity';
import { SavedSearchesService } from './saved-searches.service';
import { SavedSearchesController } from './saved-searches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SavedSearch])],
  providers: [SavedSearchesService],
  controllers: [SavedSearchesController],
  exports: [SavedSearchesService],
})
export class SavedSearchesModule {}
