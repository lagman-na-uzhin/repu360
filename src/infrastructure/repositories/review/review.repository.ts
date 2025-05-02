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

@Injectable()
export class ReviewOrmRepository implements IReviewRepository {
  constructor(
      @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async getReviewsByOrganizationPlacementId(placementId: PlacementId): Promise<Review[]> {
    const entities = await this.manager.find(ReviewEntity, {
      where: { placementId: placementId.toString() },
    });

    return Promise.all(entities.map(this.toDomain));
  }

  async saveAll(reviews: Review[]): Promise<void> {
    const reviewEntities = reviews.map((review) => this.fromDomain(review));
    await this.manager.save(ReviewEntity, reviewEntities);
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
    const twogisDetail = review.getTwogisReviewPlacementDetail();
    const yandexDetail = review.getYandexReviewPlacementDetail();

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



  async getByExternalIds(externalIds: string[]): Promise<Review[]> {
    return Promise.resolve([]);
  }

  private async toDomain(entity: ReviewEntity): Promise<Review> {
    const placementDetail = this.toDomainPlacementDetail(entity)
    return Review.fromPersistence(
        entity.id,
        entity.placementId,
        entity.profileId,
        entity.platform,
        entity.text,
        entity.rating,
        [],
        placementDetail
    );
  }

  private toDomainPlacementDetail(entity: ReviewEntity): ReviewPlacementDetail {
    if (entity.twogisDetail) {
      return TwogisReviewPlacementDetail.fromPersistence(entity.twogisDetail.externalId);
    } else {
      return YandexReviewPlacementDetail.fromPersistence(entity.yandexDetail!.externalId);
    }
  }
}
