import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {YandexPlacementDetail} from "@domain/placement/model/yandex-placement-detail";
import {
    TwogisPlacementDetailEntity
} from "@infrastructure/entities/placement/placement-details/twogis-placement.entity";
import {
    YandexPlacementDetailEntity
} from "@infrastructure/entities/placement/placement-details/yandex-placement.entity";
import {OrganizationId} from "@domain/organization/organization";

export class PlacementOrmRepository implements IPlacementRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}
    async getById(id: PlacementId): Promise<Placement | null> {
        const entity = await this.manager.getRepository(OrganizationPlacementEntity).findOne({where: {
            id: id.toString()
            }, relations: ['twogisDetail']
        })

        return entity ? this.toDomain(entity) : null;
    }

    async getActiveTwogisPlacements(): Promise<Placement[]> {
        const entities = await this.manager
            .getRepository(OrganizationPlacementEntity)
            .createQueryBuilder('placement')
            // Просто присоединяем отношение, давая ему четкий псевдоним.
            // TypeORM сам сгенерирует условие ON на основе @JoinColumn.
            .leftJoinAndSelect('placement.twogisDetail', 'twogisDetailAlias')
            // Теперь применяем условие WHERE к ПРАВИЛЬНОМУ столбцу
            .where('twogisDetailAlias.placementId IS NOT NULL')
            // Если вам нужен и этот фильтр:
            // .andWhere('twogisDetailAlias.cabinetPassword IS NOT NULL')
            .getMany();

        return entities.map(this.toDomain);
    }

    async save(placement: Placement): Promise<void> {
        await this.manager
            .getRepository(OrganizationPlacementEntity)
            .save(this.fromDomain(placement));
    }

    async batchSave(placements: Placement[]): Promise<void> {
        const entities = placements.map(this.fromDomain)
        await this.manager.getRepository(OrganizationPlacementEntity).save(entities);
    }

    async getActiveTwogisListOfAutoReply(): Promise<Placement[]> {
        const entities = await this.manager.getRepository(OrganizationPlacementEntity)
            .createQueryBuilder('placement')
            .leftJoinAndSelect('placement.autoReply', 'autoReply')
            .leftJoinAndSelect('placement.twogisDetail', 'twogisDetail')
            .where('placement.platform = :platform', { platform: PLATFORMS.TWOGIS })
            // .andWhere('autoReply.isEnabled = true AND autoReply.deletedAt IS NULL')
            // .andWhere(`
            //       (
            //         autoReply.is_schedule_enabled = false OR
            //         (
            //           autoReply.is_schedule_enabled = true AND
            //           autoReply.start_time IS NOT NULL AND
            //           autoReply.end_time IS NOT NULL AND
            //           (
            //             (autoReply.start_time <= autoReply.end_time AND current_timestamp::time BETWEEN autoReply.start_time AND autoReply.end_time) OR
            //             (autoReply.start_time > autoReply.end_time AND
            //               (current_timestamp::time >= autoReply.start_time OR current_timestamp::time <= autoReply.end_time)
            //             )
            //           )
            //         )
            //       )
            // `)
            .andWhere('twogisDetail.cabinetLogin IS NOT NULL AND twogisDetail.cabinetPassword IS NOT NULL')
            .getMany();

        return entities.map(this.toDomain);
    }

    private fromDomain(placement: Placement): OrganizationPlacementEntity {
        const entity = new OrganizationPlacementEntity();

        entity.id = placement.id.toString();
        entity.organizationId = placement.organizationId.toString();
        entity.platform = placement.platform;
        entity.externalId = placement.externalId;
        entity.rating = placement.rating;

        if (placement.placementDetail instanceof TwogisPlacementDetail) {
            const twogisDetailEntity = new TwogisPlacementDetailEntity();
            const detail = placement.getTwogisPlacementDetail();
            twogisDetailEntity.placementId = placement.id.toString()
            entity.twogisDetail = twogisDetailEntity;
        } else if (placement.placementDetail instanceof YandexPlacementDetail) {
            const yandexDetailEntity = new YandexPlacementDetailEntity();
            yandexDetailEntity.placementId = placement.id.toString();
            entity.yandexDetail = yandexDetailEntity;
        } else {
            throw new Error("Unsupported Placement Detail Type");
        }

        return entity;
    }

    private toDomain(entity: OrganizationPlacementEntity) {
        let placementDetail;
        if (entity.twogisDetail) {
            placementDetail = TwogisPlacementDetail.fromPersistence(
                entity.twogisDetail.cabinetLogin,
                entity.twogisDetail.cabinetPassword
            );
        } else if (entity.yandexDetail) {
            placementDetail = YandexPlacementDetail.fromPersistence()
        } else {
            throw new Error("Placement Detail Not Found")
        }
        return Placement.fromPersistence(
            entity.id,
            entity.organizationId,
            entity.platform,
            entity.externalId,
            entity.rating,
            placementDetail
        )
    }

    private createQb() {
        return this.manager
            .getRepository(OrganizationPlacementEntity)
            .createQueryBuilder('placement')
            .leftJoinAndSelect('placement.yandexDetail', 'yandexDetail')
            .leftJoinAndSelect('placement.twogisDetail', 'twogisDetail')
    }

    async getTwogisPlacementByExternalId(externalId: string): Promise<Placement | null> {
        const entity = await this.createQb()
            .where('placement.externalId = :externalId', { externalId })
            .getOne()

        return entity ? this.toDomain(entity) : null;
    }

    async getYandexPlacementByExternalId(externalId: string): Promise<Placement | null> {
        const entity = await this.createQb()
            .where('yandexDetail.externalId = :externalId', { externalId })
            .getOne();

        return entity ? this.toDomain(entity) : null;
    }

    async getTwogisByOrgId(organizationId: OrganizationId): Promise<Placement | null> {
        const entity = await this.manager.getRepository(OrganizationPlacementEntity).findOne({
            where: {
                organizationId: organizationId.toString()
            }
        })
        console.log(entity, "entity")
        return entity ? this.toDomain(entity) : null;
    }
}
