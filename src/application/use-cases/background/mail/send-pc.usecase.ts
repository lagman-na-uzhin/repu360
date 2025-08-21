import {IMailerService, IMail} from "@application/interfaces/services/mailer/mailer-service.interface";
import {IMailerRepository} from "@application/interfaces/services/mailer/mailer-repository.interface";

export class SendMailProcessUseCase {
    constructor(
        private readonly mailerRepo: IMailerRepository,
        private readonly mailerService: IMailerService,
    ) {}

    async execute(mail: IMail) {
        await this.mailerService.send(mail);

        return this.mailerRepo.markAsSent(mail.id);
    }
}
