import {FilterParams, GetListParams} from "@domain/common/repositories/get-list.interface";

export interface GetLeadListFilter extends FilterParams{
    readonly status?: "NOT_ASSIGNED" | "PROCESSING" | "PROCESSED"
}
export interface GetLeadListParams extends GetListParams<GetLeadListFilter> {}
