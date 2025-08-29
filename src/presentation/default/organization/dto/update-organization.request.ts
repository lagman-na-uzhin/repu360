import {
    IsString,
    ValidateNested,
} from 'class-validator';
import {Transform } from 'class-transformer';
import {OrganizationId} from "@domain/organization/organization";
import {PLATFORMS} from "@domain/common/platfoms.enum";
import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";

export class UpdateOrganizationParamRequestDto {
    @Transform(({ value }) => OrganizationId.of(value))
    readonly organizationId: OrganizationId;
}

export class UpdateOrganizationBodyRequestDto {
    @ValidateNested()
    workingSchedule?: {
        dailyHours:{
            uniqueRelation: string
            dayOfWeek: DayOfWeek
            startTime: string
            endTime: string
            breakStartTime?: string
            breakEndTime: string
        }[]
        id: string
        isTemporarilyClosed: boolean
    };

    @ValidateNested({ each: true })
    rubrics?: {
        external: {
            name: string
            externalId: string
            platform: PLATFORMS
        }[]};

    name?: string;
}
