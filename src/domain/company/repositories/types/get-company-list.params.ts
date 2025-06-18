import {FilterParams, GetListParams} from "@domain/common/repositories/get-list.interface";
import {ManagerId} from "@domain/manager/manager";

export interface GetCompanyListFilterParams extends FilterParams {
    readonly managerId?: ManagerId
}
export interface GetCompanyListParams extends GetListParams<GetCompanyListFilterParams> {}
