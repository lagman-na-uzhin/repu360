import { IProfileRepository } from '@domain/review/repositories/profile-repository.interface';
import { Profile, ProfileId } from '@domain/review/profile';
import { EntityManager, Repository } from 'typeorm';
import { ProfileEntity } from 'src/infrastructure/entities/profile/profile.entity';
import { TwogisProfilePlacementDetailEntity } from '@infrastructure/entities/profile/placement-details/twogis-profile.entity';
import { YandexProfilePlacementDetailEntity } from '@infrastructure/entities/profile/placement-details/yandex-profile.entity';
import { TwogisProfilePlacementDetail } from '@domain/review/model/profile/twogis-profile-placement-detail';
import { YandexProfilePlacementDetail } from '@domain/review/model/profile/yandex-profile-placement-detail';
import {profile} from "winston";
import {InjectEntityManager} from "@nestjs/typeorm";

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
        await this.manager.save(ProfileEntity, profileEntities);

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
            entity.placement,
            entity.firstname,
            entity.surname,
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

        const platform = platformMappings[entity.placement];

        if (platform.details) {
            return platform.getModel(platform.details);
        } else {
            const detailEntity = await platform.repository.findOne({ where: { profileId: entity.id } });
            return platform.getModel(detailEntity!);
        }
    }

    private fromDomain(profile: Profile): ProfileEntity {
        const entity = new ProfileEntity();
        entity.id = profile.id.toString();
        entity.firstname = profile.firstname;
        entity.surname = profile.surname;
        entity.avatar = profile.avatar;
        entity.placement = profile.platform;
        return entity;
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

    getByExternalIds(externalIds: string[]): Promise<Profile[]> {
        return Promise.resolve([]);
    }
}
