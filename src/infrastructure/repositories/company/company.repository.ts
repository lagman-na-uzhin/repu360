import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {Company, CompanyId} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';

@Injectable()
export class CompanyOrmRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>,
  ) {}

  async getById(id: CompanyId): Promise<Company | null> {
    const entity = await this.repo.findOne({where: { id: id.toString() }})
    return entity ? this.toModel(entity) : null;
  }

  async save(company: Company): Promise<void> {
    console.log(this.toEntity(company));
    await this.repo.save(this.toEntity(company))
  }

  private toModel(entity: CompanyEntity): Company {
    return Company.fromPersistence(
        entity.id,
        entity.ownerId,
        entity.managerId,


    )
  }
}
