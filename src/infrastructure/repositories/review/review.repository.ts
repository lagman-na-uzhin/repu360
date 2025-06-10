import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IReviewRepository } from '@domain/review/repositories/review-repository.interface';
import { ReviewEntity } from 'src/infrastructure/entities/review/review.entity';
import {Review, ReviewId, ReviewPlacementDetail} from '@domain/review/review';
import { TwogisReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/twogis-review.entity';
import { YandexReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/yandex-review.entity';
import { ReviewMediaEntity } from '@infrastructure/entities/review/review-media.entity';
import {PlacementId} from "@domain/placement/placement";
import {TwogisReviewPlacementDetail} from "@domain/review/model/review/twogis-review-placement-detail";
import {YandexReviewPlacementDetail} from "@domain/review/model/review/yandex-review-placement-detail";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Reply} from "@domain/review/model/review/reply/reply";
import {AutoReplyEntity} from "@infrastructure/entities/autoreply/autoreply.entity";
import {ReviewReplyEntity} from "@infrastructure/entities/review/review-reply.entity";

@Injectable()
export class ReviewOrmRepository implements IReviewRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

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
    entity.profileId = review.profileId.toString();
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

  private async toDomain(entity: ReviewEntity): Promise<Review> {
    const placementDetail = this.toDomainPlacementDetail(entity);
    const replies = entity.replies?.length > 0
        ? entity.replies.map(replyEntity => this.toDomainReply(replyEntity))
        : [];
    return Review.fromPersistence(
        entity.id,
        entity.placementId,
        entity.profileId,
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

  private toDomainPlacementDetail(entity: ReviewEntity): ReviewPlacementDetail {
    console.log(entity.twogisDetail, "toDomainPlacementDetail")
      if (entity.twogisDetail) {
        return TwogisReviewPlacementDetail.fromPersistence(entity.twogisDetail.externalId);
      } else {
        return YandexReviewPlacementDetail.fromPersistence(entity.yandexDetail!.externalId);
      }
    }
}
