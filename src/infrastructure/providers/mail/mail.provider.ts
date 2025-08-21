import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {SendMailProcessUseCase} from "@application/use-cases/background/mail/send-pc.usecase";
import {MailProxy} from "@application/use-case-proxies/mail/mail.proxy";
import {IMailerRepository} from "@application/interfaces/services/mailer/mailer-repository.interface";
import {IMailerService} from "@application/interfaces/services/mailer/mailer-service.interface";
import {MailerOrmRepository} from "@infrastructure/repositories/mailer/mailer.repository";
import {MailerService} from "@infrastructure/services/mail/mailer.service";

export const mailProxyProviders = [
    {
        inject: [MailerOrmRepository, MailerService],
        provide: MailProxy.SEND_MAIL_PROCESS,
        useFactory: (
            mailerRepo: IMailerRepository,
            mailerService: IMailerService
        ) => {
            return new UseCaseProxy(new SendMailProcessUseCase(
                mailerRepo,
                mailerService
            ))
        }
    },
]
