import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";
import {Platform} from "@domain/placement/types/platfoms.enum";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {YandexPlacementDetail} from "@domain/placement/model/yandex-placement-detail";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {CompanyEntity} from "@infrastructure/entities/company/company.entity";

export class PlacementOrmRepository implements IPlacementRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        private readonly base: BaseRepository<CompanyEntity>
    ) {}
    async getById(id: PlacementId): Promise<Placement | null> {
        return {} as Placement | null;
    }

    async getActiveTwogisPlacements(): Promise<Placement[]> {
        return [] as Placement[]
    }

    async save(placement: Placement): Promise<Placement> {
        return {} as Placement
    }

    async getActiveTwogisListOfAutoReply(): Promise<Placement[]> {
        const entities = await this.manager.getRepository(OrganizationPlacementEntity)
            .createQueryBuilder('placement')
            .innerJoin('placement.autoReply', 'autoreply')
            .leftJoin('placement.twogisDetail', 'twogisDetail')
            .where(
                '((placement.placement = :placement', {platform: Platform.TWOGIS})
            .andWhere(
                'autoReply.isFreezing = false AND autoReply.deletedAt IS NULL',
            )
            .andWhere(
                `(autoreply.is_schedule_enabled = false OR 
         (autoreply.is_schedule_enabled = true AND 
          autoreply.start_time is not null AND autoreply.end_time is not null AND  
            (
              (start_time <= end_time AND current_timestamp::time BETWEEN start_time AND end_time)
              OR
              (start_time > end_time AND (current_timestamp::time >= start_time OR current_timestamp::time <= end_time))
            )
          ))`,
            )
            .andWhere(
                'twogisDetail.cabinetLogin is not null AND twogisDetail.cabinetPassword is not null',
            )
            .getMany();

        return entities.map(this.toDomain)
    }

    private toDomain(entity: OrganizationPlacementEntity) {
        let placementDetail;
        if (entity.twogisDetail) {
            placementDetail = TwogisPlacementDetail.fromPersistence(
                entity.twogisDetail.externalId,
                entity.twogisDetail.type,
                entity.twogisDetail.cabinetLogin,
                entity.twogisDetail.cabinetPassword
            );
        } else if (entity.yandexDetail) {
            placementDetail = YandexPlacementDetail.fromPersistence(entity.yandexDetail.externalId)
        } else {
            throw new Error("Placement Detail Not Found")
        }
        return Placement.fromPersistence(
            entity.id,
            entity.organizationId,
            entity.platform,
            placementDetail
        )
    }
}
