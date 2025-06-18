import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {Company, CompanyId} from '@domain/company/company';
import {ICompanyRepository} from '@domain/company/repositories/company-repository.interface';
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {GetCompanyListParams} from "@domain/company/repositories/types/get-company-list.params";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {PlacementId} from "@domain/placement/placement";

@Injectable()
export class CompanyOrmRepository extends BaseRepository<CompanyEntity> implements ICompanyRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {
    super()
  }

  async getById(id: CompanyId): Promise<Company | null> {
    const entity = await this.manager.getRepository(CompanyEntity).findOne({where: { id: id.toString() }})
    return entity ? this.toDomain(entity) : null;
  }

  async save(company: Company): Promise<void> {
    await this.manager.getRepository(CompanyEntity).save(this.toPersistence(company))
  }

  async getCompanyList(params: GetCompanyListParams): Promise<PaginatedResult<Company>> {
    const { filter } = params;

    const qb = this.manager.getRepository(CompanyEntity).createQueryBuilder('company');

    if (filter?.managerId) {
      qb.andWhere('company.city = :city', { city: filter.managerId });
    }

    return this.getList<Company>(qb, this.toDomain, params.pagination,  params.sort);
  }

  async getCompanyByPlacementId(placementId: PlacementId): Promise<Company | null> {
    const entity = await this.manager
        .getRepository(CompanyEntity)
        .createQueryBuilder('company')
        .leftJoin('company.organizations', 'organization')
        .leftJoin('organization.placements', 'placement')
        .where('placement.id = :id', {id: placementId.toString()})
        .getOne();

    return entity ? this.toDomain(entity) : null;
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
