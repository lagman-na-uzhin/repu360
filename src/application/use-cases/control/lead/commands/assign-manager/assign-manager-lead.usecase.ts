import {
    AssignManagerLeadCommand
} from "@application/use-cases/control/lead/commands/assign-manager/assign-manager-lead.command";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {LeadPolicy} from "@domain/policy/policies/lead-policy";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {ManagerId} from "@domain/manager/manager";

export class AssignManagerLeadUseCase {
    constructor(
        private readonly leadRepo: ILeadRepository
    ) {}

    async execute(cmd: AssignManagerLeadCommand): Promise<void> {
        const lead = await this.leadRepo.getById(cmd.leadId);
        if (!lead) throw new Error(EXCEPTION.LEAD.NOT_FOUND);

        lead.managerId = this.getManagerId(cmd);

        await this.leadRepo.save(lead);
    }

    private getManagerId(cmd: AssignManagerLeadCommand): ManagerId {
        let managerId: ManagerId;
        if (cmd?.managerId) {
            if (!LeadPolicy.canAssignManager(cmd.actor))
                throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);

            managerId = cmd.managerId;
        } else {
            if (!LeadPolicy.canAssignHimselfAsManager(cmd.actor))
                throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);

            managerId = cmd.actor.id;
        }

        return managerId;
    }
}
