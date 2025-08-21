import {IMailerRepository} from "@application/interfaces/services/mailer/mailer-repository.interface";
import {Injectable} from "@nestjs/common";
import {IMail} from "@application/interfaces/services/mailer/mailer-service.interface";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import MailEntity from "@infrastructure/entities/mail/mail.entity";

@Injectable()
export class MailerOrmRepository implements IMailerRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async save(mail: IMail): Promise<{ id: string }> {
        const savedMail = await this.manager.getRepository(MailEntity).save(mail);
        return { id: savedMail.id }
    }

    async markAsSent(id: string): Promise<void> {
        await this.manager.getRepository(MailEntity).update(id, {sendDate: new Date()});
    }
}
