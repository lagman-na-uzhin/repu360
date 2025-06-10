import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, Equal} from "typeorm";
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";
import {Platform} from "@domain/placement/types/platfoms.enum";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {YandexPlacementDetail} from "@domain/placement/model/yandex-placement-detail";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {CompanyEntity} from "@infrastructure/entities/company/company.entity";

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
            .leftJoinAndSelect('placement.twogisDetail', 'twogisDetail')
            .where('twogisDetail.id IS NOT NULL')
            // .where('twogisDetail.cabinetLogin IS NOT NULL')
            // .andWhere('twogisDetail.cabinetPassword IS NOT NULL')
            .getMany();

        return entities.map(this.toDomain);
    }

    async save(placement: Placement): Promise<Placement> {
        return {} as Placement
    }

    async getActiveTwogisListOfAutoReply(): Promise<Placement[]> {
        const entities = await this.manager.getRepository(OrganizationPlacementEntity)
            .createQueryBuilder('placement')
            .leftJoinAndSelect('placement.autoReply', 'autoReply')
            .leftJoinAndSelect('placement.twogisDetail', 'twogisDetail')
            .where('placement.platform = :platform', { platform: Platform.TWOGIS })
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
