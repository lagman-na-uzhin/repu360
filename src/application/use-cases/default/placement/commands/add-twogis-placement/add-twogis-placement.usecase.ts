import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {
    IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {Placement } from "@domain/placement/placement";
import {
    TwogisAddPlacementCommand
} from "@application/use-cases/default/placement/commands/add-twogis-placement/twogis-add-placement.command";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {Organization, OrganizationId} from "@domain/organization/organization";

export class AddTwogisPlacementUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
        private readonly placementRepo: IPlacementRepository
    ) {
    }

    async execute(command: TwogisAddPlacementCommand): Promise<Placement> {
        const organization = await this.getOrganizationOrFail(command.organizationId);

        const placement = this.createPlacement(organization.id, command);

        await this.placementRepo.save(placement);
        return placement;
    }


    private async getOrganizationOrFail(organizationId: OrganizationId): Promise<Organization> {
        const organization = await this.organizationRepo.getById(organizationId);
        if (!organization) {
            throw new Error(EXCEPTION.ORGANIZATION.NOT_FOUND);
        }
        return organization;
    }

    private createPlacement(organizationId: OrganizationId, command: TwogisAddPlacementCommand): Placement {
        const cabinetCredentials = this.createCredentials(command.cabinetLogin, command.cabinetPassword);
        const twogisDetail = TwogisPlacementDetail.create(command.externalId, command.type, cabinetCredentials);

        return Placement.create(
            organizationId,
            command.platform,
            twogisDetail
        );
    }

    private createCredentials(login?: string, password?: string): TwogisCabinetCredentials | null {
        if (typeof login === 'string' && typeof password === 'string' && login.trim() && password.trim()) {
            return new TwogisCabinetCredentials(login, password);
        }
        return null;
    }
}
