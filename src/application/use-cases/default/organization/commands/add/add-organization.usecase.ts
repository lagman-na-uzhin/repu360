import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {
    IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {Placement } from "@domain/placement/placement";
import {AddOrganizationCommand} from "@application/use-cases/default/organization/commands/add/add-organization.command";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Organization, OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/placement/platfoms.enum";
import {YandexPlacementDetail} from "@domain/placement/model/yandex-placement-detail";
import {PlacementDetail} from "@domain/placement/types/placement-detail.types";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";

export class AddOrganizationUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly organizationRepo: IOrganizationRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly uof: IUnitOfWork
    ) {
    }

    async execute(command: AddOrganizationCommand): Promise<void> {
        const company = await this.companyRepo.getById(command.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        console.log(company, "company")
        const organization = Organization.create(company.id, command.name, command.address);

        console.log(organization, "oreganizatuion")
        const createdPlacements: Placement[] = [];
        for (const p of command.placements) {
            const placement = await this.createAndValidatePlacement(
                organization.id,
                p.externalId,
                p.platform,
                p.type
            );
            createdPlacements.push(placement);
        }

        console.log(createdPlacements, "createdPlacements")
        await this.uof.run(async (ctx) => {
            await ctx.organizationRepo.save(organization);
            await ctx.placementRepo.batchSave(createdPlacements);
        })
    }
    private async createAndValidatePlacement(
        organizationId: OrganizationId,
        externalId: string,
        platform: PLATFORMS,
        type: string
    ): Promise < Placement > {
        let placementDetail: PlacementDetail;
        let existingPlacement: Placement | null = null;

        switch (platform) {
            case "TWOGIS":
                existingPlacement = await this.placementRepo.getTwogisPlacementByExternalId(externalId);
                if (existingPlacement) {
                    throw new Error(EXCEPTION.PLACEMENT.ALREADY_EXIST);
                }
                placementDetail = TwogisPlacementDetail.create(externalId, type, null);
                break;

            case "YANDEX":
                existingPlacement = await this.placementRepo.getYandexPlacementByExternalId(externalId);
                if (existingPlacement) {
                    throw new Error(EXCEPTION.PLACEMENT.ALREADY_EXIST);
                }
                placementDetail = YandexPlacementDetail.create();
                break;

            default:
                throw new Error(EXCEPTION.PLACEMENT.UNSUPPORTED_PLATFORM);
        }

        return Placement.create(organizationId, platform, placementDetail);
    }
}
