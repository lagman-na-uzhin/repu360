import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationEntity } from '@infrastructure/entities/organization/organization.entity';
import { OrganizationPlacementEntity } from '@infrastructure/entities/placement/organization-placement.entity';
import { IOrganizationRepository } from '@domain/organization/repositories/organization-repository.interface';
import { UniqueEntityID } from '@domain/common/unique-id';
import { Organization, OrganizationId } from '@domain/organization/organization';
import { TwogisPlacementDetailEntity } from '@infrastructure/entities/placement/placement-details/twogis-placement.entity';
import { YandexPlacementDetailEntity } from '@infrastructure/entities/placement/placement-details/yandex-placement.entity';
import {Placement} from "@domain/placement/placement";
import { Platform } from '@domain/common/enums/platfoms.enum';
import { PartnerId } from '@domain/company/company';
import { TwogisPlacementDetail } from '@domain/placement/model/twogis-placement-detail';
import { YandexPlacementDetail } from '@domain/placement/model/yandex-placement-detail';

@Injectable()
export class OrganizationOrmRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly repo: Repository<OrganizationEntity>,
    @InjectRepository(OrganizationPlacementEntity)
    private readonly placementRepo: Repository<OrganizationPlacementEntity>,
    @InjectRepository(TwogisPlacementDetailEntity)
    private readonly twogisRepo: Repository<TwogisPlacementDetailEntity>,
    @InjectRepository(YandexPlacementDetailEntity)
    private readonly yandexRepo: Repository<YandexPlacementDetailEntity>,
  ) {}

  async getById(id: string): Promise<Organization | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['platforms'],
    });
    return entity ? this.toModel(entity) : null;
  }

  async getPlacementById(
    placementId: string,
  ): Promise<Placement | null> {
    return null as Placement | null
  }

  async save(organization: Organization): Promise<void> {
    const entity = this.toEntity(organization);
    await this.repo.save(entity);
  }

  async getOrganizationPlatformById(
    id: string,
  ): Promise<Placement | null> {
    const entity = await this.placementRepo.findOne({ where: { id } });
    return entity ? this.platformToModel(entity) : null;
  }

  async getActiveList(): Promise<Organization[]> {
    const entities = await this.repo
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.platforms', 'platforms')
      .leftJoin('organization.company', 'partner')
      .leftJoin('company.tariff', 'tariff')
      .where('tariff.isActive = :isActive', { isActive: true })
      .andWhere('organization.isActive = :isActive', { isActive: true })
      .execute();
    return await Promise.all(entities.map(this.toModel));
  }

  async getActiveTwogisPlatformList(): Promise<Placement[]> {
    const entities: OrganizationPlacementEntity[] = await this.placementRepo
      .createQueryBuilder('platforms')
      .leftJoin('platforms.organization', 'organization')
      .leftJoin('organization.company', 'partner')
      .leftJoin('company.tariff', 'tariff')
      .where('tariff.isActive = :isActive', { isActive: true })
      .andWhere('organization.isActive = :isActive', { isActive: true })
      .andWhere('platforms.placement-details = :type', {
        type: Platform.TWOGIS,
      })
      .execute();
    return await Promise.all(entities.map(this.platformToModel));
  }

  private async toModel(entity: OrganizationEntity): Promise<Organization> {
    const placements = await Promise.all(
      entity.placements.map((p) => this.platformToModel(p)),
    );

    return Organization.fromPersistence(
      entity.id,
      entity.partnerId,
      entity.name,
    );
  }

  private async platformToModel(
    entity: OrganizationPlacementEntity,
  ): Promise<Placement> {
    const details = await this.getDetails(entity);
    return Placement.fromPersistence(
      entity.id,
      entity.organizationId,
      entity.platform,
      details,
    );
  }
  private async getDetails(
    entity: OrganizationPlacementEntity,
  ): Promise<TwogisPlacementDetail | YandexPlacementDetail> {
    const repoMap = {
      [Platform.TWOGIS]: {
        repo: this.twogisRepo,
        create: (data: TwogisPlacementDetailEntity) =>
          TwogisPlacementDetail.fromPersistence(data.externalId, data.type),
      },
      [Platform.YANDEX]: {
        repo: this.yandexRepo,
        create: (data: YandexPlacementDetailEntity) =>
          YandexPlacementDetail.fromPersistence(data.externalId),
      },
    } as const;

    const placementData = repoMap[entity.platform];
    const detailEntity = await placementData.repo.findOneOrFail({
      where: { placementId: entity.id },
    });

    return placementData.create(detailEntity as typeof placementData.create extends (arg: infer T) => any ? T : never);
  }


  private toEntity(organization: Organization): OrganizationEntity {
    const entity = new OrganizationEntity();
    entity.id = organization.id.toString();
    entity.name = organization.name;
    entity.partnerId = organization.partnerId.toString();
    return entity;
  }

  private platformToEntity(
    placement: Placement,
  ): OrganizationPlacementEntity {
    const entity = new OrganizationPlacementEntity();
    entity.id = placement.id.toString();
    entity.organizationId = placement.organizationId.toString();
    entity.platform = placement.platform;

    if (placement.platform === Platform.TWOGIS) {
      const details = new TwogisPlacementDetailEntity();
      details.externalId = placement.getTwogisPlacementDetail().externalId
      details.type = placement.getTwogisPlacementDetail().type;
      entity.twogisDetail = details;
    } else if (placement.platform === Platform.YANDEX) {
      const details = new YandexPlacementDetailEntity();
      details.externalId = placement.getYandexPlacementDetail().externalId;
      entity.yandexDetail = details;
    }

    return entity;
  }
}
