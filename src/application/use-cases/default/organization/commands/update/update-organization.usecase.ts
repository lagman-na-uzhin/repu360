import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {
    UpdateOrganizationCommand
} from "@application/use-cases/default/organization/commands/update/update-organization.command";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {IRubricRepository} from "@domain/rubric/repositories/rubric-repository.interface";
import {Rubric} from "@domain/rubric/rubric";
import {ExternalRubric} from "@domain/rubric/value-object/external-rubric.vo";

export class UpdateOrganizationUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
        private readonly rubricRepo: IRubricRepository,
        private readonly uof: IUnitOfWork
    ) {}

    async execute(command: UpdateOrganizationCommand): Promise<void> {
        console.log('use case')
        const organization = await this.organizationRepo.getById(command.organizationId);
        if (!organization) throw new Error(EXCEPTION.ORGANIZATION.NOT_FOUND);

        if (command?.name) {
            organization.name = command.name;
        }

        if (command.rubrics?.length) {
            organization.rubricIds = command.rubrics.map(r => r.id);
        }

        if (command?.workingSchedule) {
            organization.workingSchedule = command.workingSchedule;
        }

        console.log(organization, "organization")
        await this.uof.run(async (ctx) => {
            await ctx.organizationRepo.save(organization);

            if (command?.rubrics) {
                await ctx.rubricRepo.saveAll(command.rubrics);
            }
        })
    }
}
