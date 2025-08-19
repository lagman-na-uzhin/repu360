import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import {
    IOrganizationRepository
} from "@domain/organization/repositories/organization-repository.interface";
import {Placement } from "@domain/placement/placement";
import {AddOrganizationCommand} from "@application/use-cases/default/organization/commands/add/add-organization.command";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Organization, OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {YandexPlacementDetail} from "@domain/placement/model/yandex-placement-detail";
import {PlacementDetail} from "@domain/placement/types/placement-detail.types";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {ITwogisClient} from "@application/interfaces/integrations/twogis/client/twogis-client.interface";
import {WorkingSchedule} from "@domain/organization/model/organization-working-hours";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {
    OrgByIdOutDto,
    OrgItem,
    OrgSchedule
} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id.out.dto";
import {Time} from "@domain/organization/value-objects/working-hours/time.vo";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";
import {CompanyId} from "@domain/company/company";
import {GroupId} from "@domain/organization/group";
import {ITwogisRepository} from "@application/interfaces/integrations/twogis/repository/twogis-repository.interface";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {Rubric, RubricId} from "@domain/rubric/rubric";
import {OrganizationAddress} from "@domain/organization/value-objects/organization-address.vo";

export class AddOrganizationUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly organizationRepo: IOrganizationRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly uof: IUnitOfWork,
        private readonly twogisSession: ITwogisSession,
    ) {
    }

    async execute(command: AddOrganizationCommand): Promise<void> {
        await this.twogisSession.init(command.companyId);

        const company = await this.companyRepo.getById(command.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        const twogisPlacementInfo = (await this.twogisSession.getByIdOrganization(command.externalId)).result.items[0];
        const organization = this.createOrganization(company.id, command.city, command.groupId, twogisPlacementInfo);

        const placement = await this.createAndValidatePlacement(
                organization.id,
                command.externalId,
                command.platform,
                twogisPlacementInfo.type,
                twogisPlacementInfo.reviews.general_rating
        );

        console.log(organization, "organization")
        console.log(placement, "placement")
        await this.uof.run(async (ctx) => {
            await ctx.organizationRepo.save(organization);
            await ctx.placementRepo.save(placement);
        })
    }

    private createOrganization(companyId: CompanyId, city: string, groupId: GroupId | null, orgInfo: OrgItem) {
        const workingSchedule = this.createWorkingSchedule(orgInfo.schedule, orgInfo.flags["temporary_closed"]);
        const rubrics = this.createRubrics(orgInfo.rubrics)
        const address = OrganizationAddress.create(
            city,
            orgInfo.address_name,
            orgInfo.point.lat,
            orgInfo.point.lon
        );
        return Organization.create(
            companyId,
            groupId,
            orgInfo.name,
            address,
            workingSchedule,
            [],
            rubrics,
        );

    }

    private createWorkingSchedule(rawSchedule: OrgSchedule, hasTemporaryClosedFlag): WorkingSchedule {
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

        const dailyHoursArray: DailyWorkingHours[] = []; // Изменили на массив

        // Обработка круглосуточного режима, если есть
        if (rawSchedule.is_24x7) {
            const fullDayHours = new TimeRange(new Time(0, 0), new Time(24, 0)); // Или new Time(0,0), new Time(24,0) в зависимости от вашей логики

            for (const dayShort of Object.keys(dayMap)) {
                const dayOfWeek = dayMap[dayShort];
                if (dayOfWeek) {
                    dailyHoursArray.push(new DailyWorkingHours(dayOfWeek, fullDayHours));
                }
            }
        } else {
            // Если не 24/7, обрабатываем обычное расписание
            for (const [dayShort, dayData] of Object.entries(rawSchedule)) {
                // Проверяем, что dayData не null/undefined и содержит working_hours
                if (!dayData || !dayData.working_hours || dayData.working_hours.length === 0) {
                    // Если нет рабочих часов для дня, это означает выходной или неизвестно
                    // Можно добавить DailyWorkingHours с пустыми часами или просто пропустить
                    continue;
                }

                const dayOfWeek = dayMap[dayShort];
                if (!dayOfWeek) continue; // Пропускаем, если день не найден в dayMap

                // В 2ГИС schedule.working_hours - это массив, но обычно там один диапазон
                // Если диапазонов несколько, нужно будет обрабатывать их все
                const { from, to } = dayData.working_hours[0];
                const workingHours = new TimeRange(parseTime(from), parseTime(to));

                dailyHoursArray.push(new DailyWorkingHours(dayOfWeek, workingHours));
            }
        }

        return new WorkingSchedule(dailyHoursArray, hasTemporaryClosedFlag);
    }

    private createRubrics(rubricsRaw: {
        alias: string,
        "id": string,
        "kind": "primary" | "additional",
        "name": string,
        "parent_id": string,
        "short_id": number
    }[]) {
        return [] as RubricId[] //TODO save rubrics
        // return rubricsRaw.map(raw => Rubric.create(raw.alias, raw.name, raw.kind));
    }
    private async createAndValidatePlacement(
        organizationId: OrganizationId,
        externalId: string,
        platform: PLATFORMS,
        type: string,
        rating: number
    ): Promise < Placement > {
        let placementDetail: PlacementDetail;
        let existingPlacement: Placement | null = null;

        switch (platform) {
            case "TWOGIS":
                console.log("existingPlacement before")
                existingPlacement = await this.placementRepo.getTwogisPlacementByExternalId(externalId);
                console.log(existingPlacement, "existingPlacement")
                if (existingPlacement) {
                    throw new Error(EXCEPTION.PLACEMENT.ALREADY_EXIST);
                }
                placementDetail = TwogisPlacementDetail.create(type, null);
                break;

            // case "YANDEX":
            //     existingPlacement = await this.placementRepo.getYandexPlacementByExternalId(externalId);
            //     if (existingPlacement) {
            //         throw new Error(EXCEPTION.PLACEMENT.ALREADY_EXIST);
            //     }
            //     placementDetail = YandexPlacementDetail.create();
            //     break;

            default:
                throw new Error(EXCEPTION.PLACEMENT.UNSUPPORTED_PLATFORM);
        }

        return Placement.create(organizationId, platform, externalId, rating, placementDetail);
    }
}
