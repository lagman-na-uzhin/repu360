import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {LeadId} from "@domain/lead/lead";

export class ConfirmLeadCommand extends BaseCommand {
    private constructor(
        public readonly leadId: LeadId,
        actor: Actor
    ) {
        super(actor);
    }

    static of(dto: { leadId: LeadId}, actor: Actor) {
        return new ConfirmLeadCommand(
            dto.leadId,
            actor
        );
    }
}
