import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
import { Profile, ProfileId } from '@domain/review/profile';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ProfileEntity} from "src/infrastructure/entities/profile/profile.entity";
import {UniqueID} from "src/domain/common/unique-id";
import {TwogisProfilePlacementDetailEntity} from "@infrastructure/entities/profile/placement-details/twogis-profile.entity";
import {YandexProfilePlacementDetailEntity} from "@infrastructure/entities/profile/placement-details/yandex-profile.entity";
import {TwogisProfilePlacementDetail} from "@domain/review/model/profile/twogis-profile-placement-detail";
import {YandexProfilePlacementDetail} from "@domain/review/model/profile/yandex-profile-placement-detail";

export class ProfileOrmRepository implements IProfileRepository {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly repo: Repository<ProfileEntity>,
        @InjectRepository(TwogisProfilePlacementDetailEntity)
        private readonly twogisRepo: Repository<TwogisProfilePlacementDetailEntity>,
        @InjectRepository(YandexProfilePlacementDetailEntity)
        private readonly yandexRepo: Repository<YandexProfilePlacementDetailEntity>,
    ) {}

  async saveAll(profiles: Profile[]): Promise<void> {}

    async getByExternalId(externalId: string): Promise<Profile | null> {
        const entity = await this.repo
            .createQueryBuilder('profile')
            .leftJoinAndSelect('profile.twogisDetails', 'twogis')
            .leftJoinAndSelect('profile.yandexDetails', 'yandex')
            .where('twogis.profileId = :externalId OR yandex.profileId = :externalId', { externalId })
            .getOne();

        return entity ? this.toModel(entity) : null;
    }

    private async toModel(entity: ProfileEntity): Promise<Profile> {
        const detail = await this.toDetail(entity);

        return Profile.fromPersistence(
            entity.id,
            entity.platform,
            entity.firstname,
            entity.surname,
            entity.avatar,
            detail,
        )
    }

    private async toDetail(entity: ProfileEntity): Promise<TwogisProfilePlacementDetail | YandexProfilePlacementDetail> {
        const platformMappings = {
            twogis: {
                details: entity.twogisDetail,
                repository: this.twogisRepo,
                getModel: (details: TwogisProfilePlacementDetailEntity) =>
                    TwogisProfilePlacementDetail.fromPersistence(details.externalId),
            },
            yandex: {
                details: entity.yandexDetail,
                repository: this.yandexRepo,
                getModel: (details: YandexProfilePlacementDetailEntity) =>
                    YandexProfilePlacementDetail.fromPersistence(details.externalId),
            },
        };

        const platform = platformMappings[entity.platform];

        if (platform.details) {
            return platform.getModel(platform.details);
        } else {
            const detailEntity = await platform.repository.findOne({ where: { profileId: entity.id } });
            return platform.getModel(detailEntity);
        }
    }
}
