import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {Company, CompanyId} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {PaginatedResult} from "@domain/common/interfaces/repositories/paginated-result.interface";
import {GetCompanyListParams} from "@domain/company/repositories/types/get-company-list.params";
import {BaseRepository} from "@infrastructure/repositories/base-repository";

@Injectable()
export class CompanyOrmRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>,
    private readonly base: BaseRepository<CompanyEntity>
  ) {}

  async getById(id: CompanyId): Promise<Company | null> {
    const entity = await this.repo.findOne({where: { id: id.toString() }})
    return entity ? this.toDomain(entity) : null;
  }

  async save(company: Company): Promise<void> {
    await this.repo.save(this.toPersistence(company))
  }

  async getList(params: GetCompanyListParams): Promise<PaginatedResult<Company>> {
    const { filter } = params;

    const qb = this.repo.createQueryBuilder('company');

    if (filter?.managerId) {
      qb.andWhere('company.city = :city', { city: filter.managerId });
    }

    return this.base.getList<Company>(qb, this.toDomain, params.pagination,  params.sort);
  }


  private toDomain(entity: CompanyEntity): Company {
    return Company.fromPersistence(
        entity.id,
        entity.managerId,
        entity.name
    )
  }

  private toPersistence(company: Company): CompanyEntity {
    return {
      id: company.id.toString(),
      name: company.name.toString(),
      managerId: company.managerId.toString()
    } as CompanyEntity
  }
}
