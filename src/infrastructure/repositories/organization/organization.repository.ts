import { Injectable } from '@nestjs/common';
import {EntityManager, Equal, In} from 'typeorm';
import {InjectEntityManager} from '@nestjs/typeorm';
import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import { IOrganizationRepository } from '@domain/organization/repositories/organization-repository.interface';
import { Organization, OrganizationId } from '@domain/organization/organization';
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {GetOrganizationListByCompanyParams} from "@domain/organization/repositories/params/get-list-by-company.params";

@Injectable()
export class OrganizationOrmRepository
    extends BaseRepository<OrganizationEntity>
    implements IOrganizationRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {
    super()
  }

  async getById(id: OrganizationId): Promise<Organization | null> {
    const entity = await this.manager.getRepository(OrganizationEntity).findOneBy({id: Equal(id.toString())});
    return entity ? this.toDomain(entity) : null;
  }

  async save(organization: Organization): Promise<void> {
    const entity = this.toEntity(organization);
    await this.manager.getRepository(OrganizationEntity).save(entity);
  }

  async getActiveList(): Promise<Organization[]> {
    const entities = await this.manager.getRepository(OrganizationEntity)
      .createQueryBuilder('organization')
      .leftJoin('organization.company', 'company')
      .leftJoin('company.tariff', 'tariff')
      .where('tariff.isActive = :isActive', { isActive: true })
      .andWhere('organization.isActive = :isActive', { isActive: true })
      .execute();
    return await Promise.all(entities.map(this.toDomain));
  }

  async getListByCompanyId(params: GetOrganizationListByCompanyParams): Promise<PaginatedResult<Organization>> {

    const qb = this.createQb();
    qb.andWhere('organization.companyId = :companyId', { companyId: params.filter!.companyId });

    return this.getList<Organization>(qb, this.toDomain, params.pagination,  params.sort);
  }

  async getByIds(ids: OrganizationId[]): Promise<Organization[]> {
    const entities = await this.manager.getRepository(OrganizationEntity).find({
      where: {
        id: In(ids.map(id => id.toString()))
      }
    })

    return entities.map(this.toDomain);
  }

  private createQb() {
    return this.manager
        .getRepository(OrganizationEntity)
        .createQueryBuilder('organization')
  }

  private toDomain(entity: OrganizationEntity): Organization  { //TODO any
    // return Organization.fromPersistence(
    //     entity.id,
    //     entity.companyId,
    //     entity.name,
    //     entity.address
    // );

    return {} as Organization;
  }
  private toEntity(organization: Organization): OrganizationEntity {
    const entity = new OrganizationEntity();
    entity.id = organization.id.toString();
    entity.name = organization.name;
    entity.companyId = organization.companyId.toString();
    entity.address = organization.address
    return entity;
  }
}
