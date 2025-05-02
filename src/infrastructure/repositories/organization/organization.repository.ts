import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from 'typeorm';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import { OrganizationPlacementEntity } from '@infrastructure/entities/placement/organization-placement.entity';
import { IOrganizationRepository } from '@domain/organization/repositories/organization-repository.interface';
import { Organization, OrganizationId } from '@domain/organization/organization';
import { TwogisPlacementDetailEntity } from '@infrastructure/entities/placement/placement-details/twogis-placement.entity';
import { YandexPlacementDetailEntity } from '@infrastructure/entities/placement/placement-details/yandex-placement.entity';
import {Placement} from "@domain/placement/placement";
import { Platform } from '@domain/placement/types/platfoms.enum';
import { TwogisPlacementDetail } from '@domain/placement/model/twogis-placement-detail';
import { YandexPlacementDetail } from '@domain/placement/model/yandex-placement-detail';
import {PaginatedResult} from "@domain/common/interfaces/repositories/paginated-result.interface";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {GetOrganizationListByCompanyParams} from "@domain/organization/repositories/params/get-list-by-company.params";

@Injectable()
export class OrganizationOrmRepository implements IOrganizationRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
      private readonly base: BaseRepository<OrganizationEntity>
  ) {}

  async getById(id: OrganizationId): Promise<Organization | null> {
    const entity = await this.manager.getRepository(OrganizationEntity).findOne({where: { id: id.toString() }});
    return entity ? this.toDomain(entity) : null;
  }

  async save(organization: Organization): Promise<void> {
    const entity = this.toEntity(organization);
    await this.manager.getRepository(OrganizationEntity).save(entity);
  }

  async getActiveList(): Promise<Organization[]> {
    const entities = await this.manager.getRepository(OrganizationEntity)
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.platforms', 'platforms')
      .leftJoin('organization.company', 'company')
      .leftJoin('company.tariff', 'tariff')
      .where('tariff.isActive = :isActive', { isActive: true })
      .andWhere('organization.isActive = :isActive', { isActive: true })
      .execute();
    return await Promise.all(entities.map(this.toDomain));
  }

  async getListByCompanyId(params: GetOrganizationListByCompanyParams): Promise<PaginatedResult<Organization>> {

    const qb = this.manager.getRepository(OrganizationEntity).createQueryBuilder('organization');

    qb.andWhere('organization.companyId = :companyId', { companyId: params.filter?.companyId });


    return this.base.getList<Organization>(qb, this.toDomain, params.pagination,  params.sort);
  }


  private toDomain(entity: OrganizationEntity): Organization {
    return Organization.fromPersistence(
      entity.id,
      entity.companyId,
      entity.name,
    );
  }

  private toEntity(organization: Organization): OrganizationEntity {
    const entity = new OrganizationEntity();
    entity.id = organization.id.toString();
    entity.name = organization.name;
    entity.companyId = organization.companyId.toString();
    return entity;
  }
}
