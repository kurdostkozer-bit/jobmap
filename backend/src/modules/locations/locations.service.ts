import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Governorate, District, Neighborhood } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Governorate)
    private governoratesRepository: Repository<Governorate>,
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
    @InjectRepository(Neighborhood)
    private neighborhoodsRepository: Repository<Neighborhood>,
  ) {}

  async findAllGovernorates() {
    return await this.governoratesRepository.find();
  }

  async findGovernorateById(id: string) {
    return await this.governoratesRepository.findOne({
      where: { id },
      relations: ['districts'],
    });
  }

  async findDistrictsByGovernorate(governorateId: string) {
    return await this.districtsRepository.find({
      where: { governorateId },
      relations: ['neighborhoods'],
    });
  }

  async findNeighborhoodsByDistrict(districtId: string) {
    return await this.neighborhoodsRepository.find({
      where: { districtId },
    });
  }

  async getLocationDrillDown(governorateId: string) {
    const governorate = await this.governoratesRepository.findOne({
      where: { id: governorateId },
    });

    const districts = await this.districtsRepository.find({
      where: { governorateId },
    });

    const neighborhoods = await Promise.all(
      districts.map((d) =>
        this.neighborhoodsRepository.find({ where: { districtId: d.id } }),
      ),
    );

    return {
      governorate,
      districts: districts.map((d, idx) => ({
        ...d,
        neighborhoods: neighborhoods[idx],
      })),
    };
  }
}
