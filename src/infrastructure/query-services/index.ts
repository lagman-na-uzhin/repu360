import {EmployeeQueryService} from "@infrastructure/query-services/employee-query.service";
import {OrganizationQueryService} from "@infrastructure/query-services/organization-query.service";
import {ReviewQueryService} from "@infrastructure/query-services/review-query.service";
import {ManagerQueryService} from "@infrastructure/query-services/manager-query.service";

export const QUERY_SERVICES = [
    EmployeeQueryService,
    OrganizationQueryService,
    ReviewQueryService,
    ManagerQueryService
]
