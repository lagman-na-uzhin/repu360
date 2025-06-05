import {
  SyncTwogisReviewsProcessUseCase
} from "@application/use-cases/background/review/twogis/sync/sync-reviews-pc.usecase";
import {ITwogisRepository} from "@application/interfaces/integrations/twogis/repository/twogis-repository.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
import {TwogisRepository} from "@infrastructure/integrations/twogis/twogis.repository";
import {ReviewOrmRepository} from "@infrastructure/repositories/review/review.repository";
import {ProfileOrmRepository} from "@infrastructure/repositories/profile/profile.repository";
import {
  SyncTwogisReviewsScheduleUseCase
} from "@application/use-cases/background/review/twogis/sync/sync-reviews-sh.usecase";
import {ITaskService} from "@application/interfaces/services/task/task-service.interface";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {PlacementOrmRepository} from "@infrastructure/repositories/placement/placement.repository";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {UnitOfWork} from "@infrastructure/services/unit-of-work/unit-of-work.service";
import {
  TwogisCreateSendReplyTaskScheduleUseCase
} from "@application/use-cases/background/review/twogis/reply/create-reply-task-sh.usecase";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import {BullService} from "@infrastructure/services/bull/bull.service";
import {CacheRepository} from "@infrastructure/repositories/cache/cache.repository";
import {
  TwogisSendReplyProcessUseCase
} from "@application/use-cases/background/review/twogis/reply/send-reply-pc.usecase";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {IProxyService} from "@application/interfaces/services/proxy/proxy-service.interface";
import {IReplyTemplateRepository} from "@domain/review/repositories/reply-template-repository.interface";
import {
  ILanguageDetectorService
} from "@application/interfaces/services/language-detector/language-detector-service.interface";
import {ITemplateService} from "@application/interfaces/services/template/template-service.interface";
import {ProxyService} from "@infrastructure/services/request/proxy.service";
import {TemplateService} from "@infrastructure/services/template/template.service";
import {LanguageDetectorService} from "@infrastructure/services/language-detector/language-detector.service";
import {ReplyTemplateOrmRepository} from "@infrastructure/repositories/auto-reply/reply-template.repository";

export const reviewProxyProviders = [
  {
    inject: [PlacementOrmRepository, TwogisRepository, ReviewOrmRepository, ProfileOrmRepository, UnitOfWork],
    provide: ReviewProxy.TWOGIS_SYNC_REVIEWS_PROCESS_USE_CASE,
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
    provide: ReviewProxy.TWOGIS_SYNC_REVIEWS_SCHEDULE_USE_CASE,
    useFactory: (placementRepo: IPlacementRepository, taskService: ITaskService) => {
      return new UseCaseProxy(new SyncTwogisReviewsScheduleUseCase(placementRepo, taskService))
    }
  },

  {
    inject: [ReviewOrmRepository, PlacementOrmRepository, BullService, CacheRepository],
    provide: ReviewProxy.TWOGIS_CREATE_SEND_REPLY_TASK_SH_USE_CASE,
    useFactory: (reviewRepo: IReviewRepository, placementRepo: IPlacementRepository, taskService: ITaskService, cacheRepo: ICacheRepository) => {
      return new UseCaseProxy(new TwogisCreateSendReplyTaskScheduleUseCase(reviewRepo, placementRepo, taskService, cacheRepo))
    }
  },

  {
    inject: [
      TwogisRepository,
      CacheRepository,
      ReviewOrmRepository,
      PlacementOrmRepository,
      ProxyService,
      ProfileOrmRepository,
      ReplyTemplateOrmRepository,
      LanguageDetectorService,
      TemplateService
    ],
    provide: ReviewProxy.TWOGIS_CREATE_SEND_REPLY_TASK_SH_USE_CASE,
    useFactory: (
        twogisRepo: ITwogisRepository,
        cacheRepo: ICacheRepository,
        reviewRepo: IReviewRepository,
        placementRepo: IPlacementRepository,
        proxyService: IProxyService,
        profileRepo: IProfileRepository,
        replyTemplateRepo: IReplyTemplateRepository,
        languageDetectorService: ILanguageDetectorService,
        templateService: ITemplateService
    ) => {
      return new UseCaseProxy(new TwogisSendReplyProcessUseCase(
          twogisRepo,
          cacheRepo,
          reviewRepo,
          placementRepo,
          proxyService,
          profileRepo,
          replyTemplateRepo,
          languageDetectorService,
          templateService
          ))
    }
  }
]

