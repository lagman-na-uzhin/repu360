import {
    QSWorkingScheduleEntryDto
} from "@application/interfaces/query-services/organization-qs/dto/response/working-schedule.dto";
import {
    QSOrganizationRubricsDto
} from "@application/interfaces/query-services/organization-qs/dto/response/rubrics.dto";
import {
    QSOrganizationPlacementDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-placement.dto";

export interface QSOrganizationDto {
    id: string;
    name: string;
    address: string;
    isTemporarilyClosed: boolean;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;

    workingSchedules: QSWorkingScheduleEntryDto[];
    rubrics: QSOrganizationRubricsDto[];
    placements: QSOrganizationPlacementDto[];
}
