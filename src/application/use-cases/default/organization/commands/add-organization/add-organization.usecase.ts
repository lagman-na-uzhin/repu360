import { LogMethod } from '@infrastructure/common/decorators/logging.decorator';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {
    AddOrganizationCommand,
} from "@application/use-cases/default/organization/commands/add-organization/add-organization.command";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {Organization} from "@domain/organization/organization";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {CompanyPolicy} from "@domain/policy/policies/company-policy";
import {Platform} from "@domain/placement/types/platfoms.enum";

export class AddOrganizationUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    @LogMethod(AddOrganizationUseCase.name)
    async execute(cmd: AddOrganizationCommand): Promise<void> {
        if (!CompanyPolicy.canAddOrganizationToCompany(cmd.actor)) {
            throw new Error(EXCEPTION.ROLE.PERMISSION_DENIED);
        }
        const company = await this.companyRepo.getById(cmd.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        const organization = Organization.create(company.id, cmd.name);

        // await this.organizationRepo.save(organization);
    }

    private async addPlacementsToOrganization(cmd: AddOrganizationCommand) {
        // if (cmd?.twogisExternalPlacementId) {
        // }
        // if (cmd?.yandexExternalPlacementId) {
        // }
    }

    private async findAndSaveTwogisPlacement() {

    }
}
