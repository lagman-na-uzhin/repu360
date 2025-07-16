import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import {isInitTypeEnv, TYPE_ENV} from "../../init";
import {CreateSendReplyTaskSh} from "@presentation/background/auto-reply/create-send-reply-task.sh";
import {TwogisSendReplyPc} from "@presentation/background/auto-reply/twogis-send-reply-pc";
import {SyncReviewsSchedule} from "@presentation/background/review/sync/sync-reviews.schedule";
import {SyncTwogisReviewsProcess} from "@presentation/background/review/sync/sync-twogis.reviews.process";

const IMPORT_PROVIDERS_BY_TYPE_ENV = () => {
    const schedules: any = [];
    const processes: any = [];


    // if (isInitTypeEnv(TYPE_ENV.AUTO_REPLY)) {
    //     schedules.push(CreateSendReplyTaskSh);
    //     processes.push(TwogisSendReplyPc);
    // }

    if (isInitTypeEnv(TYPE_ENV.REVIEW_SYNC)) {
        schedules.push(SyncReviewsSchedule);
        processes.push(SyncTwogisReviewsProcess);
    }


    return [...processes, ...schedules];
};
@Module({
    imports: [UsecaseProxyModule.register()],
    providers: [...IMPORT_PROVIDERS_BY_TYPE_ENV()],
})
export class BackgroundModule {}
