import { Inject, Injectable } from '@nestjs/common';
import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {QUEUES} from "@application/interfaces/services/task/task-service.interface";
import {MailProxy} from "@application/use-case-proxies/mail/mail.proxy";
import {SendMailProcessUseCase} from "@application/use-cases/background/mail/send-pc.usecase";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";

@Injectable()
@Processor(QUEUES.SEND_MAIL_QUEUE)
export class SendMailProcess {
    constructor(
        @Inject(MailProxy.SEND_MAIL_PROCESS)
        private readonly sendMailProcess: UseCaseProxy<SendMailProcessUseCase>,
    ) {}
    @Process({ concurrency: 10 })
    private process(job: Job) {
        return this.sendMailProcess
            .getInstance()
            .execute(job.data);
    }

    @OnQueueError()
    error(queue, err) {
        console.log('ERR_MAIL', JSON.stringify(queue.data), err);
        console.log('ERR_MAIL', JSON.stringify(queue.data), err);
    }

    @OnQueueFailed()
    failed(queue, err) {
        console.log('ERR_MAIL', JSON.stringify(queue.data), err);
        console.log('ERR_MAIL', JSON.stringify(queue.data), err);
    }
}
