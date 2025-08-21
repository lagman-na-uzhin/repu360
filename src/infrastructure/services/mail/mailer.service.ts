import {IMailerService, IMail} from "@application/interfaces/services/mailer/mailer-service.interface";
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as NodeMail from 'nodemailer/lib/mailer';
import { EnvConfigService } from '../../config/env-config/env-config.service';
import * as ejs from 'ejs';
import {MAIL_TEMPLATES} from "@infrastructure/services/mail/mailer-template.const";


@Injectable()
export class MailerService implements IMailerService {
    private nodemailerTransport: NodeMail;
    private imapConfig: {
        host: string;
        port: number;
        mail: string;
        password: string;
    }
;

    constructor(private readonly configService: EnvConfigService) {
        this.nodemailerTransport = createTransport({
            host: configService.getMailerHost(),
            port: configService.getMailerPort(),
            auth: {
                user: configService.getMailerUser(),
                pass: configService.getMailerPassword(),
            },
        });

        this.imapConfig = this.initIMapConfig(configService);
    }

    async send(mail: IMail) {
        const { template, email, payload } = mail;

        const { title, body } = MAIL_TEMPLATES[template];

        const bodyHtml = ejs.render(body, payload);

        await this.nodemailerTransport.sendMail({
            to: email,
            from: this.configService.getMailerUser(),
            subject: title,
            html: bodyHtml,
        });
    }

    private initIMapConfig(configService: EnvConfigService): {
        host: string;
        port: number;
        mail: string;
        password: string;
    } {
        return {
            host: configService.getImapHost(),
            mail: configService.getImapMail(),
            password: configService.getImapPassword(),
            port: configService.getImapPort(),
        }
    }
}

