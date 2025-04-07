import { LogMethod } from '@infrastructure/common/decorators/logging.decorator';
import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {
    IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {Placement } from "@domain/placement/placement";
import {
    TwogisAddPlacementCommand
} from "@application/use-cases/default/placement/dto/twogis-add-placement.command";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";

export class AddTwogisPlacementUseCase {
    constructor(
        private readonly organizationRepo: IOrganizationRepository,
        private readonly placementRepo: IPlacementRepository
    ) {}

    @LogMethod(AddTwogisPlacementUseCase.name)
    async execute(command: TwogisAddPlacementCommand): Promise<Placement> {
        const organization = await this.organizationRepo.getById(command.organizationId.toString());
        if (!organization) throw new Error(EXCEPTION.ORGANIZATION.NOT_FOUND);

        const placement = Placement.create(
            organization.id,
            command.platform,
            TwogisPlacementDetail.create(command.externalId, command.type)
        )

        await this.placementRepo.save(placement);

        return placement;
    }
}
