import {
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import {Inject, Injectable} from '@nestjs/common';
import { Job } from 'bull';
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {
  SyncTwogisReviewsProcessUseCase
} from "@application/use-cases/background/review/twogis/sync/sync-reviews-pc.usecase";
import {QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {PlacementId} from "@domain/placement/placement";

@Injectable()
@Processor(QUEUES.SYNC_TWOGIS_REVIEWS)
export class SyncTwogisReviewsProcess {
  constructor(
    @Inject(ReviewProxy.TWOGIS_SYNC_REVIEWS_PROCESS_USE_CASE)
    private readonly syncTwogisReviewsProcessUseCaseProxy: UseCaseProxy<SyncTwogisReviewsProcessUseCase>,
  ) {}
  @Process({ concurrency: 1 })
  private async process(job: Job) {
    return this.syncTwogisReviewsProcessUseCaseProxy.getInstance().execute(new PlacementId(job.data.placementId));
  }

  @OnQueueError()
  error(queue, err) {
    const jobId = queue?.opts?.jobId;
    console.error(
      `Task "${jobId}" errored, Data: ${JSON.stringify(queue.data)}, ${err}`,
    );
  }

  @OnQueueFailed()
  failed(queue, err) {
    const jobId = queue.opts.jobId;
    console.error(
      `Task "${jobId}" failed. Error: ${err}, Data: ${JSON.stringify(queue.data)}`,
    );
  }

  @OnQueueStalled()
  stalled(queue, err) {
    const jobId = queue.opts.jobId;
    console.error(
      `Task "${jobId}" stalled. Error: ${err}, Data: ${JSON.stringify(queue.data)}`,
    );
  }
}
