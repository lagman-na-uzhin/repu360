import {
    QSOrganizationAddressDto
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-address.dto";
import {
    QsOrganizationGroup
} from "@application/interfaces/query-services/organization-qs/dto/response/organization-group.dto";

export interface QSOrganizationCompactDto {
    id: string;
    name: string;
    group: QsOrganizationGroup | null;
    address: QSOrganizationAddressDto;
    companyId: string;
}
