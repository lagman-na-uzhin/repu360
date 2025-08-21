import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {Organization, OrganizationId} from "@domain/organization/organization";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {OrgItem, OrgSchedule} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {Placement} from "@domain/placement/placement";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {Time} from "@domain/organization/value-objects/working-hours/time.vo";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";
import {Rubric} from "@domain/rubric/rubric";
import {ExternalRubric} from "@domain/rubric/value-object/external-rubric.vo";
import {PLATFORMS} from "@domain/common/platfoms.enum";

export class SyncOrganizationProcessUseCase { //TODO make as schedule :mayb)
    constructor(
        private readonly placementRepo: IPlacementRepository,
        private readonly twogisSession: ITwogisSession,
        private readonly organizationRepo: IOrganizationRepository,
        private readonly uow: IUnitOfWork,
    ) {
    }

    async execute(organizationId: OrganizationId) {
        await this.twogisSession.init();

        const organization = await this.organizationRepo.getById(organizationId);
        if (!organization) throw new Error(EXCEPTION.ORGANIZATION.NOT_FOUND);

        this.sync(organization);

        await this.uow.run(async (ctx) => {
            await ctx.organizationRepo.save(organization);
            // await ctx.placementRepo.save(placement);
        })
    }

    private sync(organization: Organization, placement: Placement) {
        this.syncRubrics(organization);

        this.syncWorkingSchedule(externalInfo.schedule, organization)
        // this.syncPlacement(externalInfo.reviews.general_rating, placement)
    }
    private syncWorkingSchedule(rawSchedule: OrgSchedule, organization: Organization) {
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

        const dailyHoursArray: DailyWorkingHours[] = [];

        if (rawSchedule.is_24x7) {
            const fullDayHours = new TimeRange(new Time(0, 0), new Time(24, 0));

            for (const dayShort of Object.keys(dayMap)) {
                const dayOfWeek = dayMap[dayShort];
                if (dayOfWeek) {
                    dailyHoursArray.push(new DailyWorkingHours(dayOfWeek, fullDayHours));
                }
            }
        } else {
            for (const [dayShort, dayData] of Object.entries(rawSchedule)) {
                if (!dayData || !dayData.working_hours || dayData.working_hours.length === 0) {
                    continue;
                }

                const dayOfWeek = dayMap[dayShort];
                if (!dayOfWeek) continue;

                const { from, to } = dayData.working_hours[0];
                const workingHours = new TimeRange(parseTime(from), parseTime(to));

                dailyHoursArray.push(new DailyWorkingHours(dayOfWeek, workingHours));
            }
        }

        organization.workingSchedule = new WorkingSchedule(dailyHoursArray);
    }

    private async syncRubrics(
        organization: Organization,
        rubrics: Rubric[],
        externalRubrics: { id: string; name: string }[]
    ): Promise<void> {
        const rubricIdsFromOrg = new Set(
            rubrics.flatMap(r =>
                r.external
                    .filter(i => i.platform === 'TWOGIS')
                    .map(i => i.externalId)
            )
        );

        const externalRubricIds = new Set(externalRubrics.map(er => er.id));

        const idsToAdd: string[] = [];
        const idsToDelete: string[] = [];

        for (const id of externalRubricIds) {
            if (!rubricIdsFromOrg.has(id)) {
                idsToDelete.push(id);
            }
        }

        for (const id of rubricIdsFromOrg) {
            if (!externalRubricIds.has(id)) {
                idsToAdd.push(id);
            }
        }

        if (idsToAdd.length > 0) {
            await this.twogisSession.addRubrics(idsToAdd);
        }
        if (idsToDelete.length > 0) {
            await this.twogisSession.deleteRubrics(idsToDelete);
        }

        const finalRubricIds = new Set(externalRubricIds);
        for (const id of idsToAdd) {
            finalRubricIds.add(id);
        }
        for (const id of idsToDelete) {
            finalRubricIds.delete(id);
        }

        organization.rubrics = finalRubricIds
    }

    private syncPlacement(
        rating: number,
        placement: Placement,
    ): void {
        if (placement.rating !== rating) {
            placement.rating = rating;
        }
    }
}

