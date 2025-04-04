import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import {ReviewProxy} from "src/infrastructure/usecase-proxy/review/review.proxy";
import {
  SyncTwogisReviewsScheduleUseCase
} from "@application/use-cases/background/review/twogis/sync-reviews/sync-reviews-sh.usecase";

@Injectable()
export class SyncTwogisReviewsSchedule {
  constructor(
    @Inject(ReviewProxy.SYNC_TWOGIS_REVIEWS_SCHEDULE_USE_CASE)
    private readonly syncTwogisReviewScheduleUseCaseProxy: UseCaseProxy<SyncTwogisReviewsScheduleUseCase>,
  ) {}

  @Interval(10_000)
  async scheduleOrganizationReview() {
    return this.syncTwogisReviewScheduleUseCaseProxy.getInstance().execute();
  }
}
