import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDTO } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(ownerId: string, createCompanyDTO: CreateCompanyDTO): Promise<Company> {
    const existingCompany = await this.companiesRepository.findOne({
      where: { email: createCompanyDTO.email },
    });

    if (existingCompany) {
      throw new BadRequestException('Company with this email already exists');
    }

    const company = this.companiesRepository.create({
      ...createCompanyDTO,
      ownerId,
    });

    return await this.companiesRepository.save(company);
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async findByOwnerId(ownerId: string): Promise<Company[]> {
    return await this.companiesRepository.find({
      where: { ownerId },
      relations: ['owner'],
    });
  }

  async update(id: string, ownerId: string, updateData: Partial<CreateCompanyDTO>): Promise<Company> {
    const company = await this.findById(id);

    if (company.ownerId !== ownerId) {
      throw new BadRequestException('You can only update your own company');
    }

    Object.assign(company, updateData);
    return await this.companiesRepository.save(company);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const company = await this.findById(id);

    if (company.ownerId !== ownerId) {
      throw new BadRequestException('You can only delete your own company');
    }

    await this.companiesRepository.remove(company);
  }

  async findByGovernorate(governorate: string): Promise<Company[]> {
    return await this.companiesRepository.find({
      where: { governorate, isActive: true },
    });
  }
}
