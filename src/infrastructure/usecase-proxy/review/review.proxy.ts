import { PREFIX } from 'src/infrastructure/usecase-proxy/prefix';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { OrganizationOrmRepository } from 'src/infrastructure/repositories/organization/organization.repository';
import {
  SyncTwogisReviewsProcessUseCase
} from "@application/use-cases/background/review/twogis/sync-reviews/sync-reviews-pc.usecase";
import {
  IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {ITwogisRepository} from "src/application/integrations/twogis/repository/twogis-repository.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
import {TwogisRepository} from "src/infrastructure/integrations/twogis/twogis.repository";
import {ReviewOrmRepository} from "src/infrastructure/repositories/review/review.repository";
import {ProfileOrmRepository} from "src/infrastructure/repositories/profile/profile.repository";
import {
  SyncTwogisReviewsScheduleUseCase
} from "@application/use-cases/background/review/twogis/sync-reviews/sync-reviews-sh.usecase";
import {ITaskService} from "src/application/services/task/task-service.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";

export enum ReviewProxy {
  SYNC_TWOGIS_REVIEWS_PROCESS_USE_CASE = `${PREFIX.REVIEW_PROXY}SyncReviewsProcessUseCaseProxy`,
  SYNC_TWOGIS_REVIEWS_SCHEDULE_USE_CASE = `${PREFIX.REVIEW_PROXY}SyncReviewsProcessUseCaseProxy`,
}

export const reviewProxyProviders = [
  {
    inject: [OrganizationOrmRepository, TwogisRepository, ReviewOrmRepository, ProfileOrmRepository],
    provide: ReviewProxy.SYNC_TWOGIS_REVIEWS_PROCESS_USE_CASE,
    useFactory: (organizationRepo: IOrganizationRepository, twogisRepo: ITwogisRepository, reviewRepo: IReviewRepository, profileRepo: IProfileRepository) => {
        return new UseCaseProxy(new SyncTwogisReviewsProcessUseCase(organizationRepo, twogisRepo, reviewRepo, profileRepo))
    }
  },
  {
    inject: [OrganizationOrmRepository, ],
    provide: ReviewProxy.SYNC_TWOGIS_REVIEWS_SCHEDULE_USE_CASE,
    useFactory: (placementRepo: IPlacementRepository, taskService: ITaskService) => {
      return new UseCaseProxy(new SyncTwogisReviewsScheduleUseCase(placementRepo, taskService))
    }
  }
]
export const reviewProxyExports = []
