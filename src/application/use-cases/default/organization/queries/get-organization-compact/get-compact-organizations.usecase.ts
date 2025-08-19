import {IOrganizationQs} from "@application/interfaces/query-services/organization-qs/organization-qs.interface";
import {
    GetCompactOrganizationQuery
} from "@application/use-cases/default/organization/queries/get-organization-compact/get-compact-organization.query";

export class GetCompactOrganizationsUseCase {
    constructor(
        private readonly organizationQs: IOrganizationQs
    ) {}

    async execute(query: GetCompactOrganizationQuery) {
       return this.organizationQs.getCompactOrganizations(query);
    }
}
