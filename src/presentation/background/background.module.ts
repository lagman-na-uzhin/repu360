import { Module } from '@nestjs/common';
import { UsecaseProxyModule } from '@infrastructure/providers/usecase-proxy.module';
import {isInitTypeEnv, TYPE_ENV} from "../../init";
import {
    TwogisSendReplyProcessUseCase
} from "@application/use-cases/background/review/twogis/reply/send-reply-pc.usecase";
import {
    TwogisCreateSendReplyTaskScheduleUseCase
} from "@application/use-cases/background/review/twogis/reply/create-reply-task-sh.usecase";

const IMPORT_PROVIDERS_BY_TYPE_ENV = () => {
    const schedules: any = [];
    const processes: any = [];


    if (isInitTypeEnv(TYPE_ENV.AUTO_REPLy)) {
        schedules.push(TwogisCreateSendReplyTaskScheduleUseCase);
        processes.push(TwogisSendReplyProcessUseCase);
    }


    return [...processes, ...schedules];
};
@Module({
    imports: [UsecaseProxyModule.register()],
    providers: [...IMPORT_PROVIDERS_BY_TYPE_ENV()],
})
export class BackgroundModule {}
