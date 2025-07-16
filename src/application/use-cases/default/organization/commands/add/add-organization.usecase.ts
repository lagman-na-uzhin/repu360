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
import {ITwogisClient} from "@application/interfaces/integrations/twogis/client/twogis-client.interface";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {OrgByIdOutDto, OrgSchedule} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {Time} from "@domain/organization/value-objects/working-hours/time.vo";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";

export class AddOrganizationUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly organizationRepo: IOrganizationRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly uof: IUnitOfWork,
        private readonly twogisClient: ITwogisClient
    ) {
    }

    async execute(command: AddOrganizationCommand): Promise<void> {
        const company = await this.companyRepo.getById(command.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        const twogisPlacementInfo = await this.twogisClient.getById(command.placements.find(placement => placement.platform == "TWOGIS")?.externalId);

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

    private createOrganization(orgInfo: OrgByIdOutDto) {
        const workingSchedule = this.createWorkingSchedule(orgInfo.items[0].schedule);
        const contactPoints = this.createContactPoints()
        const organization = Organization.create(
            company.id,
            command.name,
            command.address,
            workingSchedule,

        );

    }

    private createWorkingSchedule(rawSchedule: OrgSchedule) {
        const dayMap: Record<string, DayOfWeek> = {
            Mon: DayOfWeek.MONDAY,
            Tue: DayOfWeek.TUESDAY,
            Wed: DayOfWeek.WEDNESDAY,
            Thu: DayOfWeek.THURSDAY,
            Fri: DayOfWeek.FRIDAY,
            Sat: DayOfWeek.SATURDAY,
            Sun: DayOfWeek.SUNDAY,
        };

        function parseTime(str: string): Time {
            const [hour, minute] = str.split(":").map(Number);
            return new Time(hour, minute);
        }

        const dailyHoursMap = new Map<DayOfWeek, DailyWorkingHours>();

        for (const [dayShort, { working_hours }] of Object.entries(rawSchedule)) {
            const dayOfWeek = dayMap[dayShort];
            if (!dayOfWeek || !working_hours || working_hours.length === 0) continue;

            const { from, to } = working_hours[0];
            const workingHours = new TimeRange(parseTime(from), parseTime(to));

            const dailyHours = new DailyWorkingHours(dayOfWeek, workingHours);
            dailyHoursMap.set(dayOfWeek, dailyHours);
        }

        return  new WorkingSchedule(dailyHoursMap);
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
                placementDetail = TwogisPlacementDetail.create(type, null);
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

        return Placement.create(organizationId, platform, externalId, placementDetail);
    }
}
