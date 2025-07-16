import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IReviewRepository } from '@domain/review/repositories/review-repository.interface';
import { ReviewEntity } from 'src/infrastructure/entities/review/review.entity';
import {Review, ReviewId, ReviewPlacementDetail} from '@domain/review/review';
import { TwogisReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/twogis-review.entity';
import { YandexReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/yandex-review.entity';
import {PlacementId} from "@domain/placement/placement";
import {TwogisReviewPlacementDetail} from "@domain/review/model/review/twogis-review-placement-detail";
import {YandexReviewPlacementDetail} from "@domain/review/model/review/yandex-review-placement-detail";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Reply} from "@domain/review/model/review/reply/reply";
import {ReviewReplyEntity} from "@infrastructure/entities/review/review-reply.entity";
import {GetReviewListFilterParams, GetReviewListParams} from "@domain/review/repositories/params/get-list.params";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {Profile, ProfileId} from "@domain/review/model/profile/profile";
import {ProfileEntity} from "@infrastructure/entities/profile/profile.entity";
import {TwogisProfilePlacementDetail} from "@domain/review/model/profile/twogis-profile-placement-detail";
import {YandexProfilePlacementDetail} from "@domain/review/model/profile/yandex-profile-placement-detail";
import {
  TwogisProfilePlacementDetailEntity
} from "@infrastructure/entities/profile/placement-details/twogis-profile.entity";
import {
  YandexProfilePlacementDetailEntity
} from "@infrastructure/entities/profile/placement-details/yandex-profile.entity";

@Injectable()
export class ReviewOrmRepository extends BaseRepository<ReviewEntity> implements IReviewRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {
    super();}

  async getReviewsByOrganizationPlacementId(placementId: PlacementId): Promise<Review[]> {
    const entities = await this.manager.find(ReviewEntity, {
      where: { placementId: placementId.toString() },
    });

    return Promise.all(entities.map(entity => this.toDomain(entity)));
  }

  async saveAll(reviews: Review[]): Promise<void> {
    const reviewEntities = reviews.map((review) => this.fromDomain(review));
    console.log(reviewEntities[0], 'review entities')
    await this.manager.getRepository(ReviewEntity).save(reviewEntities);
    console.log("AFTER PROG SAVE")
  }

  private fromDomain(review: Review): ReviewEntity {
    const { twogisDetailEntity, yandexDetailEntity } = this.fromDomainPlacementDetail(review);

    const entity = new ReviewEntity();
    entity.id = review.id.toString();
    entity.placementId = review.placementId.toString();
    entity.profileId = review.profile.id.toString();
    entity.platform = review.platform;
    entity.text = review.text;
    entity.rating = review.rating;
    entity.twogisDetail = twogisDetailEntity;
    entity.yandexDetail = yandexDetailEntity;

    return entity;
  }

  private fromDomainPlacementDetail(review: Review) {
    let twogisDetail: TwogisReviewPlacementDetail | null = null;
    let yandexDetail: YandexReviewPlacementDetail | null = null;
    
    try {
      twogisDetail = review.getTwogisReviewPlacementDetail();
      yandexDetail = review.getYandexReviewPlacementDetail();
    } catch {}

    const twogisDetailEntity = twogisDetail
        ? {
            reviewId: review.id.toString(),
            externalId: twogisDetail.externalId,
          } as TwogisReviewPlacementDetailEntity
        : null;

    const yandexDetailEntity = yandexDetail
        ? {
          reviewId: review.id.toString(),
          externalId: yandexDetail.externalId,
        } as YandexReviewPlacementDetailEntity
        : null;

    return { twogisDetailEntity, yandexDetailEntity };
  }



  async getByTwogisExternalId(externalId: string): Promise<Review | null> {
    const entity = await this.manager.findOne(ReviewEntity, {
      where: {
        twogisDetail: { externalId }
      }
    });

    return entity ? this.toDomain(entity) : null;
  }



  async getByTwogisExternalIds(externalIds: string[]): Promise<Review[]> {
    if (!externalIds.length) return [];

    const entities = await this.manager
        .getRepository(ReviewEntity)
        .createQueryBuilder('review')
        .innerJoinAndSelect('review.twogisDetail', 'twogisDetail')
        .where('twogisDetail.externalId IN (:...externalIds)', { externalIds })
        .getMany();

    return Promise.all(entities.map(entity => this.toDomain(entity)));
  }

  async delete(id: ReviewId): Promise<void> {
    await this.manager.getRepository(ReviewEntity).softDelete(id.toString())
  }

  async getById(id: ReviewId): Promise<Review | null> {
    const entity = await this.manager.getRepository(ReviewEntity).findOne({where: {id: id.toString()}})
    return entity ? this.toDomain(entity) : null;
  }

  async getTwogisReviewForReply(placementId: PlacementId): Promise<Review | null> {
    const entity = await this.manager
        .getRepository(ReviewEntity)
        .createQueryBuilder("review")
        .leftJoinAndSelect('review.twogisDetail', 'twogisDetail')
        .leftJoinAndSelect('review.replies', 'replies') // Все еще нужен, чтобы загрузить ответы для toDomain
        .where('review.placementId = :placementId', { placementId: placementId.toString() }) // Добавляем фильтр по placementId
        .andWhere(qb => { // Используем subQuery для NOT EXISTS
          const subQuery = qb.subQuery()
              .select('reviewReply.reviewId') // Выбираем reviewId из таблицы ответов
              .from(ReviewReplyEntity, 'reviewReply') // Из сущности ответов
              .where('reviewReply.reviewId = review.id') // Связываем с id отзыва из основного запроса
              .andWhere('reviewReply.isOfficial = true') // Ищем официальные ответы
              .getQuery(); // Получаем SQL строку подзапроса
          return 'NOT EXISTS ' + subQuery; // Условие: не существует ни одного официального ответа для этого отзыва
        })
        .orderBy('review.createdAt', "DESC") // Сортируем по дате создания отзыва
        .getOne(); // Получаем один результат

    return entity ? this.toDomain(entity) : null;
  }

  async save(review: Review): Promise<void> {
    const entity = this.fromDomain(review);
    await this.manager.getRepository(ReviewEntity).save(entity);
  }

  async getReviewList(params: GetReviewListParams): Promise<PaginatedResult<Review>> {
    const qb = this.createQb();
    qb.leftJoin('review.placement', 'placement').leftJoin('placement.organization', 'organization').leftJoin('organization.group', 'group')

    qb.andWhere('organization.companyId = :companyId', { companyId: params.filter!.companyId.toString() });

    if (params.filter?.groupId) {
      qb.andWhere('group.id = :groupId', {groupId: params.filter.groupId.toString()})
    }

    if (params.filter?.organizationId) {
      qb.andWhere('organization.id = :organizationId', {organizationId: params.filter.organizationId.toString()})
    }

    if (params.filter?.tone === "positive") {
      qb.andWhere('review.rating > 3');
    } else if (params.filter?.tone === "negative") {
      qb.andWhere('review.rating < 4');
    }

    return this.getList<Review>(
        qb,
        this.toDomain.bind(this),
        params.pagination,
        params.sort
    );
  }

  private createQb() {
    return this.manager
        .getRepository(ReviewEntity)
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.profile', 'profile')
        .leftJoinAndSelect('review.twogisDetail', 'twogisDetail')
        .leftJoinAndSelect('review.yandexDetail', 'yandexDetail')
        .leftJoinAndSelect('review.media', 'media')
        .leftJoinAndSelect('review.replies', 'replies')
  }

  private toDomain(entity: ReviewEntity): Review {
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

    const detail = platform.getModel(platform.details);
    console.log(detail, 'DETAIL')
    console.log(entity.profile, "ENTITY PROFILE")
    const profile = Profile.fromPersistence(
        entity.profile.id,
        entity.profile.platform,
        entity.profile.firstname,
        entity.profile.lastName,
        entity.profile.avatar,
        detail,
    );

    console.log(profile, "PROFILE")

    const placementDetail = entity.twogisDetail
        ? TwogisReviewPlacementDetail.fromPersistence(entity.twogisDetail.externalId)
        : YandexReviewPlacementDetail.fromPersistence(entity.yandexDetail!.externalId)

    console.log(placementDetail, "PLACEMENT DETAIL")
    const replies = entity.replies?.length > 0
        ? entity.replies.map(replyEntity => this.toDomainReply(replyEntity))
        : [];
    return Review.fromPersistence(
        entity.id,
        entity.placementId,
        profile,
        entity.platform,
        entity.text,
        entity.rating,
        [],
        placementDetail,
        replies
    );
  }
    private toDomainReply(entity: ReviewReplyEntity): Reply {
      return Reply.fromPersistence(entity.id, entity.externalId, entity.text, entity.isOfficial, entity.profileId, entity.type);
    }


  private toProfileDomain(entity: ProfileEntity): Profile {
    const detail = this.toProfileDetail(entity);
    return Profile.fromPersistence(
        entity.id,
        entity.platform,
        entity.firstname,
        entity.lastName,
        entity.avatar,
        detail,
    );
  }
  private toProfileDetail(entity: ProfileEntity): TwogisProfilePlacementDetail | YandexProfilePlacementDetail {
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
        throw new Error(`Profile detail not found for platform ${entity.platform} and profile ${entity.id}`);
      }
  }
}
