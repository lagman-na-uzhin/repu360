import {
    OnQueueError,
    OnQueueFailed,
    OnQueueStalled,
    Process,
    Processor,
} from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUES } from 'src/infrastructure/services/bull/bull.const';
import {ReviewProxy} from "@application/use-case-proxies/review/review.proxy";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {
    TwogisSendReplyProcessUseCase
} from "@application/use-cases/background/review/twogis/reply/send-reply-pc.usecase";

@Injectable()
@Processor(QUEUES.SEND_REPLY_QUEUE)
export class TwogisSendReplyPc {
    constructor(
        @Inject(ReviewProxy.TWOGIS_SEND_REPLY_PC_USE_CASE)
        private readonly twogisSendReplyUseCaseProxy: UseCaseProxy<TwogisSendReplyProcessUseCase>,
    ) {}

    @Process({ concurrency: 1 })
    private async process(job: Job) {
        return this.twogisSendReplyUseCaseProxy.getInstance().execute(job.data);
    }

    @OnQueueError()
    error(queue, err) {
        const jobId = queue?.opts?.jobId;
        console.error(
            `Task "${jobId}" errored. Error: ${err}, Data: ${JSON.stringify(queue.data)}`,
        );
    }

    @OnQueueFailed()
    failed(queue, err) {
        const jobId = queue.opts.jobId;
        console.error(
            `Task "${jobId}" errored. Error: ${err}, Data: ${JSON.stringify(queue.data)}`,
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
