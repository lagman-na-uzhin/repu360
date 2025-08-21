import {IMail} from "@application/interfaces/services/mailer/mailer-service.interface";

export interface IMailerRepository {
    save(mail: IMail): Promise<{id: string}>;
    markAsSent(id: string): Promise<void>;
}
