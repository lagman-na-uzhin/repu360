import { Injectable } from '@nestjs/common';
import {EntityManager, Equal, In} from 'typeorm';
import {InjectEntityManager} from '@nestjs/typeorm';
import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import { IOrganizationRepository } from '@domain/organization/repositories/organization-repository.interface';
import { Organization, OrganizationId } from '@domain/organization/organization';
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {WorkingScheduleEntity} from "@infrastructure/entities/organization/working-schedule.entity";
import {Rubric, RubricId} from "@domain/rubric/rubric";
import {OrganizationAddressEntity} from "@infrastructure/entities/organization/organization-address.entity";
import {OrganizationAddress} from "@domain/organization/value-objects/organization-address.vo";
import {WorkingScheduleEntryEntity} from "@infrastructure/entities/organization/working-schedule-entries.entity";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {ContactPoint} from "@domain/organization/value-objects/contact.point.vo";
import {ContactPointEntity} from "@infrastructure/entities/organization/contact-point.entity";

@Injectable()
export class OrganizationOrmRepository implements IOrganizationRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async getById(id: OrganizationId): Promise<Organization | null> {
    const entity = await this.manager.getRepository(OrganizationEntity).findOneBy({id: Equal(id.toString())});
    console.log(entity?.workingSchedule?.entries, "entity organizationjs")
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

    private toDomain(entity: OrganizationEntity): Organization {
        const address = OrganizationAddress.fromPersistence(
            entity.address.country,
            entity.address.city,
            entity.address.district,
            entity.address.street,
            entity.address.housenumber,
            entity.address.latitude,
            entity.address.longitude,
        );

        const workingSchedule = entity?.workingSchedule
            ? WorkingSchedule.fromPersistence({
                id: entity.workingSchedule.id,
                isTemporaryClosed: entity.workingSchedule.isTemporaryClosed,
                entries: entity.workingSchedule.entries?.map(entry => ({
                    id: entry.id,
                    dayOfWeek: entry.dayOfWeek,
                    startTime: entry?.startTime || null,
                    endTime: entry?.endTime || null,
                    breakStartTime: entry?.breakStartTime || null,
                    breakEndTime: entry?.breakEndTime || null,
                })) || [],
            })
            : null;

        return Organization.fromPersistence(
            entity.id,
            entity.companyId,
            entity.name,
            address,
            entity.group?.id || null,
            workingSchedule,
            [],
            entity.rubrics?.map(r => RubricId.of(r.id)) || [],
        );
    }

  private toEntity(organization: Organization): OrganizationEntity {
    const entity = new OrganizationEntity();
    entity.id = organization.id.toString();
    entity.name = organization.name;
    entity.companyId = organization.companyId.toString();
    entity.isActive = organization.isActive;
    entity.address = this.toAddressEntity(organization.address, organization.id);
    entity.contactPoints = organization.contactPoints.map(cp => this.toContactPointEntity(cp, organization.id))
    entity.workingSchedule = this.toWorkingScheduleEntity(organization.workingSchedule, organization.id);
    return entity;
  }

  private toContactPointEntity(domain: ContactPoint, organizationId: OrganizationId) {
      const entity = new ContactPointEntity();
      entity.organizationId = organizationId.toString();
      entity.type = domain.type;
      entity.value = domain.value;

      return entity;
  }

  private toAddressEntity(domain: OrganizationAddress, organizationId: OrganizationId) {
    const entity = new OrganizationAddressEntity();
    entity.organizationId = organizationId.toString();
    entity.country = domain.country;
    entity.city = domain.city;
    entity.district = domain.district;
    entity.street = domain.street;
    entity.housenumber = domain.housenumber;
    entity.latitude = domain.latitude;
    entity.longitude = domain.longitude;
    return entity;
  }
    private toWorkingScheduleEntity(domain: WorkingSchedule | null, organizationId: OrganizationId) {
        if (!domain) {
            return null;
        }

        const entity = new WorkingScheduleEntity();
        entity.id = domain.id.toString();
        entity.isTemporaryClosed = domain.isTemporarilyClosed;
        entity.organizationId = organizationId.toString();

        const allDailyHours = domain.getAllDailyHours();

        if (allDailyHours.length > 0) {
            entity.entries = allDailyHours
                .filter((daily): daily is DailyWorkingHours => daily !== null)
                .map(daily => {
                    const entry = new WorkingScheduleEntryEntity();
                    entry.dayOfWeek = daily.dayOfWeek;

                    if (daily.workingHours) {
                        entry.startTime = daily.workingHours.start.toString();
                        entry.endTime = daily.workingHours.end.toString();
                    }

                    entry.breakStartTime = daily.breakTime?.start.toString() ?? null;
                    entry.breakEndTime = daily.breakTime?.end.toString() ?? null;
                    entry.scheduleId = domain.id.toString();
                    return entry;
                });
        } else {
            entity.entries = null;
        }

        return entity;
    }
}
