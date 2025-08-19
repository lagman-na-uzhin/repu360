import {
    QSWorkingScheduleDto,
} from "@application/interfaces/query-services/organization-qs/dto/response/working-schedule.dto";
import {
    QSOrganizationRubricsDto
} from "@application/interfaces/query-services/organization-qs/dto/response/rubrics.dto";
import {
    QSOrganizationPlacementDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-placement.dto";
import {
    QSOrganizationAddressDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-address.dto";
import {
    QsOrganizationGroup
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-group.dto";

export interface QSOrganizationDto {
    id: string;
    name: string;
    group: QsOrganizationGroup | null;
    address: QSOrganizationAddressDto;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;

    workingSchedule: QSWorkingScheduleDto;
    rubrics: QSOrganizationRubricsDto[];
    placements: QSOrganizationPlacementDto[];
}
