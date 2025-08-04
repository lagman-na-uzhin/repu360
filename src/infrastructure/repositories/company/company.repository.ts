import { Injectable } from '@nestjs/common';
import {EntityManager} from 'typeorm';
import {InjectEntityManager} from '@nestjs/typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {Company, CompanyId} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {PlacementId} from "@domain/placement/placement";

@Injectable()
export class CompanyOrmRepository implements ICompanyRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async getById(id: CompanyId): Promise<Company | null> {
    const entity = await this.manager.getRepository(CompanyEntity).findOne({where: { id: id.toString() }})
    return entity ? this.toDomain(entity) : null;
  }

  async save(company: Company): Promise<void> {
    await this.manager.getRepository(CompanyEntity).save(this.fromDomain(company))
  }

  private toDomain(entity: CompanyEntity): Company {
    return Company.fromPersistence(
        entity.id,
        entity.managerId,
        entity.name
    )
  }

  private fromDomain(company: Company): CompanyEntity {
    return {
      id: company.id.toString(),
      name: company.name.toString(),
      managerId: company.managerId.toString()
    } as CompanyEntity
  }
}
