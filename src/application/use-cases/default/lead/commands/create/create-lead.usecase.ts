import {CreateLeadCommand} from "@application/use-cases/default/lead/commands/create/create-lead-command";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {LeadContact} from "@domain/lead/model/lead-contact";
import {Lead} from "@domain/lead/lead";

export class CreateLeadUseCase {
    constructor(
        private readonly leadRepo: ILeadRepository,
    ) {}

    async execute(cmd: CreateLeadCommand): Promise<void> {
        const contact = LeadContact.create(cmd.companyName, cmd.phone, cmd.name, cmd.email);

        const lead = Lead.create(contact);

        await this.leadRepo.save(lead);
    }
}
