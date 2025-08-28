import {PLATFORMS} from "@domain/common/platfoms.enum";
import {BaseCommand} from "@application/common/base-command";
import {Actor} from "@domain/policy/actor";
import {OrganizationId} from "@domain/organization/organization";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {Rubric} from "@domain/rubric/rubric";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {ExternalRubric} from "@domain/rubric/value-object/external-rubric.vo";

export class UpdateOrganizationCommand extends BaseCommand{
    constructor(
        public readonly organizationId: OrganizationId,
        public readonly actor: Actor,
        public readonly workingSchedule?: WorkingSchedule,
        public readonly rubrics?: Rubric[],
        public readonly name?: string,


    ) {super(actor)}

    static of(
        dto: {
            organizationId: OrganizationId;
            workingSchedule?: {
                dailyHours: {
                    dayOfWeek: DayOfWeek;
                    startTime: string;
                    endTime: string;
                    breakStartTime?: string;
                    breakEndTime: string
                }[];
                id: string,
                isTemporarilyClosed: boolean
            };
            rubrics?: {
                external: { name: string; externalId: string; platform: PLATFORMS }[]
            };
            name?: string
        },
        actor: Actor
    ) {
        let workingSchedule: WorkingSchedule | null = null;
        let rubrics: Rubric[] = [];

        if (dto.workingSchedule) {
            const workingScheduleEntries = dto.workingSchedule.dailyHours.map(dayData => ({
                dayOfWeek: dayData.dayOfWeek,
                startTime: dayData.startTime,
                endTime: dayData.endTime,
                breakStartTime: dayData?.breakStartTime ?? null,
                breakEndTime: dayData?.breakEndTime ?? null,
            }));

            workingSchedule = WorkingSchedule.fromPersistence(
                {
                    id: dto.workingSchedule.id,
                    isTemporaryClosed: dto.workingSchedule.isTemporarilyClosed,
                    entries: workingScheduleEntries,
            });
        }

        if (dto.rubrics?.external.length) {
            rubrics = []
            dto.rubrics.external.map(raw => {
                const rubric = Rubric.create(raw.name, [ExternalRubric.create(raw.platform, raw.name, raw.externalId)])
                rubrics?.push(rubric)
            })
        }
        return new UpdateOrganizationCommand(dto.organizationId, actor, workingSchedule || undefined, rubrics, dto?.name);
    }
}
