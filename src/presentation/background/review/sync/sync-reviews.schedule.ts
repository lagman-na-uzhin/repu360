import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {
  SyncTwogisReviewsScheduleUseCase
} from "@application/use-cases/background/review/twogis/sync/sync-reviews-sh.usecase";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

@Injectable()
export class SyncReviewsSchedule {
  constructor(
    @Inject(ReviewProxy.TWOGIS_SYNC_REVIEWS_SCHEDULE_USE_CASE)
    private readonly syncTwogisReviewScheduleUseCaseProxy: UseCaseProxy<SyncTwogisReviewsScheduleUseCase>,
  ) {}

  @Interval(10000)
  async syncTwogisReviews() {
    console.log("syncTwogisReviews")
    return this.syncTwogisReviewScheduleUseCaseProxy.getInstance().execute();
  }

  // @Interval(10_000)
  // async syncYandexReviews() {
  // }
}
