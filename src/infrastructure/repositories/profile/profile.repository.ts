import { IProfileRepository } from '@domain/review/repositories/profile-repository.interface';
import { Profile, ProfileId } from '@domain/review/profile';
import {EntityManager, In, Repository} from 'typeorm';
import { ProfileEntity } from 'src/infrastructure/entities/profile/profile.entity';
import { TwogisProfilePlacementDetailEntity } from '@infrastructure/entities/profile/placement-details/twogis-profile.entity';
import { YandexProfilePlacementDetailEntity } from '@infrastructure/entities/profile/placement-details/yandex-profile.entity';
import { TwogisProfilePlacementDetail } from '@domain/review/model/profile/twogis-profile-placement-detail';
import { YandexProfilePlacementDetail } from '@domain/review/model/profile/yandex-profile-placement-detail';
import {profile} from "winston";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Review} from "@domain/review/review";
import {TwogisReviewPlacementDetail} from "@domain/review/model/review/twogis-review-placement-detail";
import {YandexReviewPlacementDetail} from "@domain/review/model/review/yandex-review-placement-detail";
import {
    TwogisReviewPlacementDetailEntity
} from "@infrastructure/entities/review/placement-details/twogis-review.entity";
import {
    YandexReviewPlacementDetailEntity
} from "@infrastructure/entities/review/placement-details/yandex-review.entity";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";

export class ProfileOrmRepository implements IProfileRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getById(id: ProfileId): Promise<Profile | null> {
        const entity = await this.manager.getRepository(ProfileEntity).findOne({where: {id: id.toString()}});
        return entity ? this.toDomain(entity) : null;
    }

    async saveAll(profiles: Profile[]): Promise<void> {
        const profileEntities = profiles.map(profile => this.fromDomain(profile));
        await this.manager.getRepository(ProfileEntity).save(profileEntities);

        for (const profile of profiles) {
            const detailEntity = await this.toDetailEntity(profile);
            if (detailEntity) {
                await this.manager.save(detailEntity); // Сохраняем детали через manager
            }
        }
    }

    async getByExternalId(externalId: string): Promise<Profile | null> {
        const entity = await this.manager
            .createQueryBuilder(ProfileEntity, 'profile')
            .leftJoinAndSelect('profile.twogisDetails', 'twogis')
            .leftJoinAndSelect('profile.yandexDetails', 'yandex')
            .where('proxy-session.profileId = :externalId OR yandex.profileId = :externalId', { externalId })
            .getOne();

        return entity ? this.toDomain(entity) : null;
    }

    private async toDomain(entity: ProfileEntity): Promise<Profile> {
        const detail = await this.toDetail(entity);
        return Profile.fromPersistence(
            entity.id,
            entity.platform,
            entity.firstname,
            entity.lastName,
            entity.avatar,
            detail,
        );
    }

    private async toDetail(entity: ProfileEntity): Promise<TwogisProfilePlacementDetail | YandexProfilePlacementDetail> {
        const platformMappings = {
            twogis: {
                details: entity.twogisDetail,
                repository: this.manager.getRepository(TwogisProfilePlacementDetailEntity),
                getModel: (details: TwogisProfilePlacementDetailEntity) =>
                    TwogisProfilePlacementDetail.fromPersistence(details.externalId),
            },
            yandex: {
                details: entity.yandexDetail,
                repository: this.manager.getRepository(YandexProfilePlacementDetailEntity),
                getModel: (details: YandexProfilePlacementDetailEntity) =>
                    YandexProfilePlacementDetail.fromPersistence(details.externalId),
            },
        };

        const platformKey = entity.platform.toLowerCase();
        const platform = platformMappings[platformKey];

        if (!platform) {
            throw new Error(`Unsupported platform: ${entity.platform} for profile ${entity.id}`);
        }

        if (platform.details) {
            return platform.getModel(platform.details);
        } else {
            const detailEntity = await platform.repository.findOne({ where: { profileId: entity.id } });

            if (!detailEntity) {
                throw new Error(`Profile detail not found for platform ${entity.platform} and profile ${entity.id}`);
            }
            return platform.getModel(detailEntity);
        }
    }

    private fromDomain(profile: Profile): ProfileEntity {
        const { twogisDetailEntity, yandexDetailEntity } = this.fromDomainPlacementDetail(profile);

        const entity = new ProfileEntity();
        entity.id = profile.id.toString();
        entity.firstname = profile.firstname;
        entity.lastName = profile.lastName;
        entity.avatar = profile.avatar;
        entity.platform = profile.platform;
        entity.twogisDetail = twogisDetailEntity;
        entity.yandexDetail = yandexDetailEntity;
        return entity;
    }

    private fromDomainPlacementDetail(profile: Profile) {
        let twogisDetail: TwogisProfilePlacementDetail | null = null;
        let yandexDetail: YandexProfilePlacementDetail | null = null;

        try {
            twogisDetail = profile.getTwogisProfilePlacementDetail();
            yandexDetail = profile.getYandexProfilePlacementDetail();
        } catch {}

        let twogisDetailEntity: TwogisProfilePlacementDetailEntity | null = null;
        let yandexDetailEntity: YandexProfilePlacementDetailEntity | null = null;

        if (twogisDetail) {
            twogisDetailEntity = new TwogisProfilePlacementDetailEntity();
            twogisDetailEntity.profileId = profile.id.toString();
            twogisDetailEntity.externalId = twogisDetail.externalId;
        }

        if (yandexDetail) {
            yandexDetailEntity = new YandexProfilePlacementDetailEntity();
            yandexDetailEntity.profileId = profile.id.toString();
            yandexDetailEntity.externalId = yandexDetail.externalId;
        }

        return { twogisDetailEntity, yandexDetailEntity };
    }



    private async toDetailEntity(profile: Profile): Promise<TwogisProfilePlacementDetailEntity | YandexProfilePlacementDetailEntity | null> {
        if (profile.platform === 'TWOGIS') {
            const entity = new TwogisProfilePlacementDetailEntity();
            entity.profileId = profile.id.toString();
            return entity;
        } else if (profile.platform === 'YANDEX') {
            const entity = new YandexProfilePlacementDetailEntity();
            entity.profileId = profile.id.toString();
            return entity;
        }
        return null;
    }

    async getByTwogisExternalIds(externalIds: string[]): Promise<Profile[]> {
        if (!externalIds.length) return [];

        const entities = await this.manager
            .getRepository(ProfileEntity)
            .createQueryBuilder('profile')
            .leftJoinAndSelect('profile.twogisDetail', 'twogisDetail')
            .where('twogisDetail.externalId IN (:...externalIds)', { externalIds })
            .getMany();

        return Promise.all(entities.map(entity => this.toDomain(entity)));
    }
}
