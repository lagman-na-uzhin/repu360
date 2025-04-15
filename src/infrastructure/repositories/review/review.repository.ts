import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IReviewRepository } from '@domain/review/repositories/review-repository.interface';
import { ReviewEntity } from 'src/infrastructure/entities/review/review.entity';
import { Review, ReviewId } from '@domain/review/review';
import {TwogisReviewPlacementDetailEntity} from "@infrastructure/entities/review/placement-details/twogis-review.entity";
import {YandexReviewPlacementDetailEntity} from "@infrastructure/entities/review/placement-details/yandex-review.entity";
import { PlacementId } from '@domain/placement/placement';
import { ProfileId } from '@domain/review/profile';
import { Platform } from '@domain/placement/types/platfoms.enum';
import { TwogisReviewPlacementDetail } from '@domain/review/model/review/twogis-review-placement-detail';
import { YandexReviewPlacementDetail } from '@domain/review/model/review/yandex-review-placement-detail';
import { ReviewMedia } from '@domain/review/model/review/review-media';
import { ReviewMediaEntity } from '@infrastructure/entities/review/review-media.entity';

@Injectable()
export class ReviewOrmRepository implements IReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>,
    @InjectRepository(TwogisReviewPlacementDetailEntity)
    private readonly twogisDetailsRepo: Repository<TwogisReviewPlacementDetailEntity>,
    @InjectRepository(YandexReviewPlacementDetailEntity)
    private readonly yandexDetailsRepo: Repository<YandexReviewPlacementDetailEntity>,
    @InjectRepository(ReviewMediaEntity)
    private readonly reviewMediaRepo: Repository<ReviewMediaEntity>,
  ) {}

  async getReviewsByOrganizationPlacementId(
      placementId: PlacementId,
  ): Promise<Review[]> {
    const entities = await this.repo.find({
      where: {placementId: placementId.toString()}
    })
    return Promise.all(entities.map(this.toModel))
  }

  async getByExternalId(externalId: string): Promise<Review | null> {
    return null
  }

  async saveAll(reviews: Review[]): Promise<void> {}

  private async toModel(entity: ReviewEntity): Promise<Review> {
    const detail = await this.getDetailModel(entity);
    const media = await this.getMediaModel(entity);

    return Review.fromPersistence(
        entity.id,
        entity.placementId,
        entity.profileId,
        entity.platform,
        entity.text,
        entity.rating,
        media,
        detail,

    )
  }
  private async getDetailModel(entity: ReviewEntity): Promise<TwogisReviewPlacementDetail | YandexReviewPlacementDetail> {
    const repoMap = {
      [Platform.TWOGIS]: {
        repo: this.twogisDetailsRepo,
        create: (data: TwogisReviewPlacementDetailEntity) =>
            TwogisReviewPlacementDetail.fromPersistence(data.externalId),
      },
      [Platform.YANDEX]: {
        repo: this.yandexDetailsRepo,
        create: (data: YandexReviewPlacementDetailEntity) =>
             YandexReviewPlacementDetail.fromPersistence(data.externalId),
      },
    } as const;

    const placementData = repoMap[entity.platform];
    const detailEntity = await placementData.repo.findOne({
      where: { reviewId: entity.id },
    });
    return placementData.create(detailEntity!);
  }

  async getMediaModel(entity: ReviewEntity): Promise<ReviewMedia[]> {
    const mediaEntities = await this.reviewMediaRepo.find({where: {
      reviewId: entity.id
      }})

    return mediaEntities.map(e => ReviewMedia.fromPersistence(e.url, e.createdAt))
  }
}
