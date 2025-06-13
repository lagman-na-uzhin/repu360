import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {LeadId} from "@domain/lead/lead";
import {ManagerId} from "@domain/manager/manager";

export class AssignManagerLeadCommand extends BaseCommand {
    private constructor(
        public readonly leadId: LeadId,
        actor: Actor,
        public readonly managerId?: ManagerId,
    ) {
        super(actor);
    }

    static of(dto: { leadId: LeadId, managerId?: ManagerId}, actor: Actor) {
        return new AssignManagerLeadCommand(
            dto.leadId,
            actor,
            dto?.managerId,
        );
    }
}
