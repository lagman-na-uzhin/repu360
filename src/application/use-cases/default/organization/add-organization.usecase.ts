import { LogMethod } from '@infrastructure/common/decorators/logging.decorator';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {
    AddOrganizationCommand,
} from "@application/use-cases/default/organization/dto/add-organization.command";
import {IPartnerRepository} from "@domain/company/repositories/company-repository.interface";
import {Organization} from "@domain/organization/organization";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";

export class AddOrganizationUseCase {
    constructor(
        private readonly partnerRepo: IPartnerRepository,
        private readonly organizationRepo: IOrganizationRepository,
    ) {}

    @LogMethod(AddOrganizationUseCase.name)
    async execute(command: AddOrganizationCommand): Promise<Organization> {
        const partner = await this.partnerRepo.getById(command.partnerId);
        if (!partner) throw new Error(EXCEPTION.PARTNER.NOT_FOUND);

        const organization = Organization.create(partner.id, command.name);

        await this.organizationRepo.save(organization);

        return organization;
    }
}
