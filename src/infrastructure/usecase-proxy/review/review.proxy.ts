import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {
  SyncTwogisReviewsProcessUseCase
} from "@application/use-cases/background/review/twogis/sync-reviews/sync-reviews-pc.usecase";
import {
  IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {ITwogisRepository} from "@application/interfaces/integrations/twogis/repository/twogis-repository.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
import {TwogisRepository} from "src/infrastructure/integrations/twogis/twogis.repository";
import {ReviewOrmRepository} from "src/infrastructure/repositories/review/review.repository";
import {ProfileOrmRepository} from "src/infrastructure/repositories/profile/profile.repository";
import {
  SyncTwogisReviewsScheduleUseCase
} from "@application/use-cases/background/review/twogis/sync-reviews/sync-reviews-sh.usecase";
import {ITaskService} from "@application/interfaces/services/task/task-service.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";

export enum ReviewProxy {
  SYNC_TWOGIS_REVIEWS_PROCESS_USE_CASE = `${PREFIX.REVIEW_PROXY}SyncReviewsProcessUseCaseProxy`,
  SYNC_TWOGIS_REVIEWS_SCHEDULE_USE_CASE = `${PREFIX.REVIEW_PROXY}SyncReviewsProcessUseCaseProxy`,
}

export const reviewProxyProviders = [
  {
    inject: [PlacementOrmRepository, TwogisRepository, ReviewOrmRepository, ProfileOrmRepository, UnitOfWork],
    provide: ReviewProxy.SYNC_TWOGIS_REVIEWS_PROCESS_USE_CASE,
    useFactory: (
        placementRepo: IPlacementRepository,
        twogisRepo: ITwogisRepository,
        reviewRepo: IReviewRepository,
        profileRepo: IProfileRepository,
        uow: IUnitOfWork
    ) => {
        return new UseCaseProxy(new SyncTwogisReviewsProcessUseCase(
            placementRepo,
            twogisRepo,
            reviewRepo,
            profileRepo,
            uow
            ))
    }
  },
  {
    inject: [PlacementOrmRepository, ],
    provide: ReviewProxy.SYNC_TWOGIS_REVIEWS_SCHEDULE_USE_CASE,
    useFactory: (placementRepo: IPlacementRepository, taskService: ITaskService) => {
      return new UseCaseProxy(new SyncTwogisReviewsScheduleUseCase(placementRepo, taskService))
    }
  }
]
export const reviewProxyExports = []
