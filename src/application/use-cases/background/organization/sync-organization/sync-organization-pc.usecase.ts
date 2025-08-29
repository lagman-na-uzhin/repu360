import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {Organization, OrganizationId} from "@domain/organization/organization";
import {EXCEPTION} from "@domain/common/exceptions/exceptions.const";
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {Rubric} from "@domain/rubric/rubric";
import {IRubricRepository} from "@domain/rubric/repositories/rubric-repository.interface";
import {
    OrgByIdBusinessItem
} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id-business.out.dto";

export class SyncOrganizationProcessUseCase {
    constructor(
        private readonly placementRepo: IPlacementRepository,
        private readonly twogisSession: ITwogisSession,
        private readonly organizationRepo: IOrganizationRepository,
        private readonly rubricRepo: IRubricRepository,
    ) {}

    async execute(organizationId: OrganizationId) {
        const organization = await this.organizationRepo.getById(organizationId);
        if (!organization) throw new Error(EXCEPTION.ORGANIZATION.NOT_FOUND);

        const twogisPlacement  = await this.placementRepo.getTwogisByOrgId(organizationId);
        if (!twogisPlacement) throw new Error(EXCEPTION.PLACEMENT.TWOGIS_NOT_FOUND)

        await this.twogisSession.init(organization.companyId, twogisPlacement.getTwogisPlacementDetail().cabinetCredentials || undefined);

        const twogisExternalInfo = (await this.twogisSession.getByIdOrganizationFromBusiness(twogisPlacement.externalId)).result.items[0];

        const rubrics = await this.rubricRepo.getByIds(organization.rubricIds);

        await this.sync(organization, rubrics, twogisExternalInfo, twogisPlacement.externalId);

        await this.rubricRepo.saveAll(rubrics);
    }

    private async sync(organization: Organization, rubrics: Rubric[], twogisExternalInfo: OrgByIdBusinessItem, externalId: string) {
        await this.syncRubricsTwogis(externalId, rubrics, twogisExternalInfo.rubrics);

        await this.syncWorkingScheduleTwogis(externalId, organization.workingSchedule)
    }

    private async syncWorkingScheduleTwogis(externalId: string, workingSchedule: WorkingSchedule | null) {
        if(workingSchedule === null) {return} //TODO

        const days: {
            [key: string]: {
                from?: string;
                to?: string;
                breaks?: { from: string; to: string }[];
            };
        } = {};

        const dayAbbreviationMap = {
            [DayOfWeek.MONDAY]: "Mon",
            [DayOfWeek.TUESDAY]: "Tue",
            [DayOfWeek.WEDNESDAY]: "Wed",
            [DayOfWeek.THURSDAY]: "Thu",
            [DayOfWeek.FRIDAY]: "Fri",
            [DayOfWeek.SATURDAY]: "Sat",
            [DayOfWeek.SUNDAY]: "Sun",
        };

        for (const dayOfWeek of Object.values(DayOfWeek)) {
            const abbreviatedDay = dayAbbreviationMap[dayOfWeek];
            const dailyHours = workingSchedule.dailyHours.get(dayOfWeek);

            // Если для дня есть расписание
            if (dailyHours && dailyHours.workingHours?.start && dailyHours.workingHours?.end) {
                const dayData: {
                    from?: string;
                    to?: string;
                    breaks?: { from: string; to: string }[];
                } = {
                    from: dailyHours.workingHours?.start.toString(),
                    to: dailyHours.workingHours?.end.toString(),
                };

                if (dailyHours.breakTime) {
                    dayData.breaks = [
                        {
                            from: dailyHours.breakTime.start.toString(),
                            to: dailyHours.breakTime.end.toString(),
                        },
                    ];
                }
                days[abbreviatedDay] = dayData;
            } else {
                days[abbreviatedDay] = {};
            }
        }

        await this.twogisSession.updateWorkingHours(externalId, days);
    }
    private async syncRubricsTwogis(
        placementExternalId: string,
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
            await this.twogisSession.addRubrics(idsToAdd, placementExternalId);
        }
        if (idsToDelete.length > 0) {
            await this.twogisSession.deleteRubrics(idsToDelete, placementExternalId);
        }
    }
}

