import {IOrganizationQs} from "@application/interfaces/query-services/organization-qs/organization-qs.interface";
import {GetSummaryQuery} from "@application/use-cases/default/organization/queries/get-summary/get-summary.query";

export class GetSummaryUseCase {
    constructor(
        private readonly organizationQs: IOrganizationQs
    ) {}

    async execute(query: GetSummaryQuery) {
        console.log("GetSummaryUseCase")
        return this.organizationQs.getSummary(query);
    }
}
