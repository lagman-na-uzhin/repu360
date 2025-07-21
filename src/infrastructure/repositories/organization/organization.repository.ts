import { Injectable } from '@nestjs/common';
import {EntityManager, Equal, In} from 'typeorm';
import {InjectEntityManager} from '@nestjs/typeorm';
import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import { IOrganizationRepository } from '@domain/organization/repositories/organization-repository.interface';
import { Organization, OrganizationId } from '@domain/organization/organization';
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {GetOrganizationListByCompanyParams} from "@domain/organization/repositories/params/get-list-by-company.params";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {WorkingScheduleEntryEntity} from "@infrastructure/entities/organization/working-schedule.entity";
import {Rubric} from "@domain/organization/model/organization-rubrics";
import {OrganizationRubricsEntity} from "@infrastructure/entities/organization/rubrics.entity";

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
    entity.address = organization.address;
    entity.isTemporarilyClosed = organization.isTemporarilyClosed;
    entity.rubrics = organization.rubrics.map(r => this.toRubricsEntity(r, organization.id))
    entity.workingSchedules = this.toWorkingScheduleEntity(organization.workingSchedule, organization.id);
    return entity;
  }

  private toWorkingScheduleEntity(domain: WorkingSchedule, organizationId: OrganizationId) {
      return domain.getAllDailyHours().map(daily => {
        const entry = new WorkingScheduleEntryEntity();
        entry.organizationId = organizationId.toString();
        entry.dayOfWeek = daily.dayOfWeek;
        entry.startTime = daily.workingHours.start.toString();
        entry.endTime = daily.workingHours.end.toString();
        entry.breakStartTime = daily.breakTime?.start.toString() ?? null;
        entry.breakEndTime = daily.breakTime?.end.toString() ?? null;
        return entry;
      });
  }

  private toRubricsEntity(domain: Rubric, organizationId: OrganizationId) {
    const entity = new OrganizationRubricsEntity();
    entity.id = domain.id.toString();
    entity.organizationId = organizationId.toString()
    entity.name = domain.name;
    entity.alias = domain.alias;
    entity.type = domain.type;
    return entity;
  }
}
