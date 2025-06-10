import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ReviewProxy } from '@application/use-case-proxies/review/review.proxy';
import { SECOND } from 'time-constants';
import {
    TwogisCreateSendReplyTaskScheduleUseCase
} from "@application/use-cases/background/review/twogis/reply/create-reply-task-sh.usecase";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

@Injectable()
export class CreateSendReplyTaskSh implements OnModuleInit {
    constructor(
        @Inject(ReviewProxy.TWOGIS_CREATE_SEND_REPLY_TASK_SH_USE_CASE)
        private readonly twogisCreateSendReplyTaskUseCaseProxy: UseCaseProxy<TwogisCreateSendReplyTaskScheduleUseCase>,
    ) {}

    async onModuleInit() {
        console.log("test for CreateSendReplyTaskSh")
        await this.sendReplyTwogis();
    }

    @Interval(500000)
    async sendReplyTwogis() {
        console.log("sendReplyTwogis")
        return this.twogisCreateSendReplyTaskUseCaseProxy.getInstance().execute();
    }
}
