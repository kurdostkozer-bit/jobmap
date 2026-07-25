import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('map')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('governorates')
  async getAllGovernorates() {
    return await this.locationsService.findAllGovernorates();
  }

  @Get('governorates/:id')
  async getGovernorate(@Param('id') id: string) {
    return await this.locationsService.findGovernorateById(id);
  }

  @Get('governorates/:id/districts')
  async getDistrictsByGovernorate(@Param('id') governorateId: string) {
    return await this.locationsService.findDistrictsByGovernorate(governorateId);
  }

  @Get('districts/:id/neighborhoods')
  async getNeighborhoodsByDistrict(@Param('id') districtId: string) {
    return await this.locationsService.findNeighborhoodsByDistrict(districtId);
  }

  @Get('governorates/:id/drill-down')
  async getDrillDown(@Param('id') governorateId: string) {
    return await this.locationsService.getLocationDrillDown(governorateId);
  }
}
