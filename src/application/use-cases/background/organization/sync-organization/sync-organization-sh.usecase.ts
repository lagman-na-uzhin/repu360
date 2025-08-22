import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {Organization, OrganizationId} from "@domain/organization/organization";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {OrgSchedule} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {Placement} from "@domain/placement/placement";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {Time} from "@domain/organization/value-objects/working-hours/time.vo";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";
import {Rubric} from "@domain/rubric/rubric";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";

export class SyncOrganizationScheduleUseCase {
    constructor(
        private readonly placementRepo: IPlacementRepository,
        private readonly twogisSession: ITwogisSession,
        private readonly organizationRepo: IOrganizationRepository,
        private readonly uow: IUnitOfWork,
    ) {
    }

    async execute(organizationId: OrganizationId) {
        const organization = await this.organizationRepo.getById(organizationId);
        if (!organization) throw new Error(EXCEPTION.ORGANIZATION.NOT_FOUND);

        const cabinetCredentials = await this.getTwogisCabinetCredentialByOrgId(organization.id);

        await this.twogisSession.init(organization.companyId, cabinetCredentials);

        await this.sync(organization);
    }

    private async sync(organization: Organization, placement: Placement) {
        this.syncRubricsTwogis(organization);

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

    private async syncRubricsTwogis(
        organization: Organization,
        ourRubrics: Rubric[], // Данные из нашей системы (источник истины)
        twogisRubricsRaw: { id: string; name: string }[], // Данные из сервиса Twogis
    ): Promise<void> {
        const ourRubricIds = new Set(
            ourRubrics.flatMap(r =>
                r.external
                    .filter(i => i.platform === 'TWOGIS')
                    .map(i => i.externalId),
            ),
        );

        const twogisRubricIds = new Set(twogisRubricsRaw.map(r => r.id));

        const idsToAdd: string[] = [];
        const idsToDelete: string[] = [];

        for (const id of ourRubricIds) {
            if (!twogisRubricIds.has(id)) {
                idsToAdd.push(id);
            }
        }

        for (const id of twogisRubricIds) {
            if (!ourRubricIds.has(id)) {
                idsToDelete.push(id);
            }
        }

        if (idsToAdd.length > 0) {
            await this.twogisSession.addRubrics(idsToAdd, organization.id);
        }
        if (idsToDelete.length > 0) {
            await this.twogisSession.deleteRubrics(idsToDelete, organization.id);
        }
    }

    private syncPlacement(
        rating: number,
        placement: Placement,
    ): void {
        if (placement.rating !== rating) {
            placement.rating = rating;
        }
    }

    private async getTwogisCabinetCredentialByOrgId(organizationId: OrganizationId): Promise<TwogisCabinetCredentials> {
        const twogisPlacement  = await this.placementRepo.getTwogisByOrgId(organizationId);
        if (!twogisPlacement) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND);

        const cabinetCredentials = twogisPlacement.getTwogisPlacementDetail()?.cabinetCredentials;
        if (!cabinetCredentials) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_INVALID_CABINET_CREDENTIALS)

        return cabinetCredentials;
    }
}

