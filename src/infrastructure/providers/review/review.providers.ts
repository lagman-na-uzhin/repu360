import {
  SyncTwogisReviewsProcessUseCase
} from "@application/use-cases/background/review/twogis/sync/sync-reviews-pc.usecase";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
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
import {ICacheRepository} from "@application/interfaces/services/cache/cache-repository.interface";
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
import {TwogisSession} from "@infrastructure/integrations/twogis/twogis.session";
import {ProxySessionProxy} from "@infrastructure/providers/proxy-session/proxy-session.providers";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {CompanyOrmRepository} from "@infrastructure/repositories/company/company.repository";
import {GetReviewListUseCase} from "@application/use-cases/default/review/get-list/get-list-review.usecase";
import {IReviewQs} from "@application/interfaces/query-services/review-qs/review-qs.interface";
import {ReviewQueryService} from "@infrastructure/query-services/review-query.service";

export const reviewProxyProviders = [
  {
    inject: [PlacementOrmRepository, ProxySessionProxy.TWOGIS_SESSION, ReviewOrmRepository, ProfileOrmRepository, UnitOfWork],
    provide: ReviewProxy.TWOGIS_SYNC_REVIEWS_PROCESS_USE_CASE,
    useFactory: (
        placementRepo: IPlacementRepository,
        twogisSession: ITwogisSession,
        reviewRepo: IReviewRepository,
        profileRepo: IProfileRepository,
        uow: IUnitOfWork
    ) => {
        return new UseCaseProxy(new SyncTwogisReviewsProcessUseCase(
            placementRepo,
            twogisSession,
            reviewRepo,
            profileRepo,
            uow
            ))
    }
  },
  {
    inject: [PlacementOrmRepository, BullService],
    provide: ReviewProxy.TWOGIS_SYNC_REVIEWS_SCHEDULE_USE_CASE,
    useFactory: (placementRepo: IPlacementRepository, taskService: ITaskService) => {
      return new UseCaseProxy(new SyncTwogisReviewsScheduleUseCase(placementRepo, taskService))
    }
  },

  {
    inject: [
        ReviewOrmRepository,
        PlacementOrmRepository,
        BullService,
        CacheRepository,
        CompanyOrmRepository
    ],
    provide: ReviewProxy.TWOGIS_CREATE_SEND_REPLY_TASK_SH_USE_CASE,
    useFactory: (
        reviewRepo: IReviewRepository,
        placementRepo: IPlacementRepository,
        taskService: ITaskService,
        cacheRepo: ICacheRepository,
        companyRepo: ICompanyRepository
        ) => {
      return new UseCaseProxy(new TwogisCreateSendReplyTaskScheduleUseCase(
          reviewRepo,
          placementRepo,
          taskService,
          cacheRepo,
          companyRepo
      ))
    }
  },

  {
    inject: [
      ProxySessionProxy.TWOGIS_SESSION,
      CacheRepository,
      ReviewOrmRepository,
      PlacementOrmRepository,
      ProfileOrmRepository,
      ReplyTemplateOrmRepository,
      LanguageDetectorService,
      TemplateService
    ],
    provide: ReviewProxy.TWOGIS_SEND_REPLY_PC_USE_CASE,
    useFactory: (
        twogisSession: ITwogisSession,
        cacheRepo: ICacheRepository,
        reviewRepo: IReviewRepository,
        placementRepo: IPlacementRepository,
        profileRepo: IProfileRepository,
        replyTemplateRepo: IReplyTemplateRepository,
        languageDetectorService: ILanguageDetectorService,
        templateService: ITemplateService
    ) => {
      return new UseCaseProxy(new TwogisSendReplyProcessUseCase(
          twogisSession,
          cacheRepo,
          reviewRepo,
          placementRepo,
          profileRepo,
          replyTemplateRepo,
          languageDetectorService,
          templateService
          ))
    }
  },

  {
    inject: [ReviewQueryService],
    provide: ReviewProxy.GET_LIST,
    useFactory: (reviewQs: IReviewQs,) => {
      return new UseCaseProxy(new GetReviewListUseCase(reviewQs))
    }
  }
]

