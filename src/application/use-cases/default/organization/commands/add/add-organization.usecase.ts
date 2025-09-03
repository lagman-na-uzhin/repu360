import {EXCEPTION} from '@domain/common/exceptions/exceptions.const';
import {IOrganizationRepository} from "@domain/organization/repositories/organization-repository.interface";
import {Placement} from "@domain/placement/placement";
import {
    AddOrganizationCommand
} from "@application/use-cases/default/organization/commands/add/add-organization.command";
import {TwogisPlacementDetail} from "@domain/placement/model/twogis-placement-detail";
import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Organization, OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {PlacementDetail} from "@domain/placement/types/placement-detail.types";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";
import {IUnitOfWork} from "@application/interfaces/services/unitOfWork/unit-of-work.interface";
import {WorkingSchedule, WorkingScheduleId} from "@domain/organization/model/organization-working-hours";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";
import {DailyWorkingHours} from "@domain/organization/value-objects/working-hours/daily-working-hours.vo";
import {Time} from "@domain/organization/value-objects/working-hours/time.vo";
import {TimeRange} from "@domain/organization/value-objects/working-hours/time-range.vo";
import {CompanyId} from "@domain/company/company";
import {GroupId} from "@domain/organization/group";
import {ITwogisSession} from "@application/interfaces/integrations/twogis/twogis-session.interface";
import {Rubric} from "@domain/rubric/rubric";
import {OrganizationAddress} from "@domain/organization/value-objects/organization-address.vo";
import {
    OrgByIdBusinessContactGroup,
    OrgByIdBusinessItem,
    OrgByIdBusinessRubric,
    OrgByIdBusinessSchedule
} from "@application/interfaces/integrations/twogis/client/dto/out/org-by-id-business.out.dto";
import {ExternalRubric} from "@domain/rubric/value-object/external-rubric.vo";
import {IGeocoderService} from "@application/interfaces/services/geocoder/geocoder-service.interface";
import {TwogisCabinetCredentials} from "@domain/placement/value-object/twogis/twogis-cabinet-credentials.vo";
import {ContactPoint, ContactPointType} from "@domain/organization/value-objects/contact.point.vo";

export class AddOrganizationUseCase {
    constructor(
        private readonly companyRepo: ICompanyRepository,
        private readonly placementRepo: IPlacementRepository,
        private readonly uof: IUnitOfWork,
        private readonly twogisSession: ITwogisSession,
        private readonly geocoderService: IGeocoderService
    ) {
    }

    async execute(command: AddOrganizationCommand): Promise<void> {
        await this.twogisSession.init(command.companyId, command.cabinetCredentials);

        const company = await this.companyRepo.getById(command.companyId);
        if (!company) throw new Error(EXCEPTION.COMPANY.NOT_FOUND);

        const twogisPlacementInfo = (await this.twogisSession.getByIdOrganizationFromBusiness(command.externalId))
            .result.items
            .find(i => i.id === command.externalId);
        if (!twogisPlacementInfo) throw new Error("Can not find 2GIS fillial")

        const workingSchedule = this.createWorkingSchedule(twogisPlacementInfo.schedule);
        const rubrics = this.createRubrics(twogisPlacementInfo.rubrics);
        const address = await this.createOrganizationAddress(twogisPlacementInfo.id);
        const contactPoints = this.createContactPoints(twogisPlacementInfo.contactGroups);

        const organization = Organization.create(
            company.id,
            command.groupId,
            twogisPlacementInfo.name,
            address,
            workingSchedule,
            contactPoints,
            rubrics.map(r=>r.id),
        );


        const placement = await this.createAndValidatePlacement(
                organization.id,
                command.externalId,
                command.platform,
                5, //TODO mock
                // twogisPlacementInfo.reviews.general_rating,
            command.cabinetCredentials

        );

        await this.uof.run(async (ctx) => {
            await ctx.organizationRepo.save(organization);
            await ctx.placementRepo.save(placement);
            await ctx.rubricRepo.saveAll(rubrics);
        })
    }

    private createContactPoints(contactGroups:  OrgByIdBusinessContactGroup[]) {
        const contactTypeAdapterMap = {
            "email": ContactPointType.EMAIL,
            "web": ContactPointType.WEBSITE,
            "phone": ContactPointType.PHONE,
            "whatsapp": ContactPointType.WHATSAPP,
        }
        const rawContacts = contactGroups[0].contacts;
        return rawContacts.map(rc =>
            ContactPoint.create(contactTypeAdapterMap[rc.type], rc.value));
    }

    private async createOrganizationAddress(orgExternalId: string) {
        const {lon, lat} = await this.twogisSession.getOrganizationGeometryHover(orgExternalId);
        console.log({lon, lat}, "{lon, lat}")
        const decoded = await this.geocoderService.decoder(lat, lon);
        const decodedAddress = decoded.features[0].properties
        console.log(decoded, ':decoded')

        return OrganizationAddress.create(
            decodedAddress.country,
            decodedAddress.city,
            decodedAddress.district,
            decodedAddress.street,
            decodedAddress.housenumber,
            decodedAddress.lat,
            decodedAddress.lon
        );
    }

    private createWorkingSchedule(rawSchedule: OrgByIdBusinessSchedule): WorkingSchedule {
        const dayMap: Record<string, DayOfWeek> = {
            Mon: DayOfWeek.MONDAY,
            Tue: DayOfWeek.TUESDAY,
            Wed: DayOfWeek.WEDNESDAY,
            Thu: DayOfWeek.THURSDAY,
            Fri: DayOfWeek.FRIDAY,
            Sat: DayOfWeek.SATURDAY,
            Sun: DayOfWeek.SUNDAY,
        };
        const dailyHoursArray: DailyWorkingHours[] = [];

        function parseTime(str: string): Time {
            const [hour, minute] = str.split(":").map(Number);
            return new Time(hour, minute);
        }

        const workingScheduleId = new WorkingScheduleId();

        for (const day of Object.keys(rawSchedule.days)) {
            const dayData = rawSchedule.days[day as keyof typeof rawSchedule.days];
            const dayOfWeek = dayMap[day];
            const workingHours = dayData?.from && dayData?.from ? new TimeRange(parseTime(dayData.from), parseTime(dayData.from)) : null;
            const breakTime = dayData.breaks?.length ? new TimeRange(parseTime(dayData.breaks[0].from), parseTime(dayData.breaks[0].to)) : null;

            const dailyHours = DailyWorkingHours.create(workingScheduleId, dayOfWeek, workingHours, breakTime);
            dailyHoursArray.push(dailyHours)
        }

        return WorkingSchedule.create(dailyHoursArray, rawSchedule.isTemporarilyClosed, workingScheduleId);
    }

    private createRubrics(rubricsRaw: OrgByIdBusinessRubric[]) {
        return rubricsRaw.map(raw => Rubric.create(raw.name, [ExternalRubric.create(PLATFORMS.TWOGIS, raw.name, raw.id)]))
    }
    private async createAndValidatePlacement(
        organizationId: OrganizationId,
        externalId: string,
        platform: PLATFORMS,
        rating: number,
        cabinetCredentials: TwogisCabinetCredentials
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
                placementDetail = TwogisPlacementDetail.create(cabinetCredentials);
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
