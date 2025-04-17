import {FilterParams, GetListParams} from "@domain/common/interfaces/repositories/get-list.interface";
import {ManagerId} from "@domain/manager/manager";

export interface GetCompanyListFilter extends FilterParams{
    readonly managerId: ManagerId
}
export interface GetCompanyListParams extends GetListParams<GetCompanyListFilter> {}
