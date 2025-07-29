import {FilterParams, GetListParams} from "@application/interfaces/query-services/common/get-list.interface";

export interface GetLeadListFilter extends FilterParams{
    readonly status?: "NOT_ASSIGNED" | "PROCESSING" | "PROCESSED"
}
export interface GetLeadListParams extends GetListParams<GetLeadListFilter> {}
