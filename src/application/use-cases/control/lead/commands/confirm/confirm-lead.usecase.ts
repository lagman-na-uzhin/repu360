import {ConfirmLeadCommand} from "@application/use-cases/control/lead/commands/confirm/confirm-lead.command";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";

export class ConfirmLeadUseCase {
    constructor(
        private readonly leadRepo: ILeadRepository
    ) {}

    async execute(command: ConfirmLeadCommand): Promise<void> {
    }
}
