import {GetListParams} from "@domain/common/interfaces/repositories/get-list.interface";
import {ManagerId} from "@domain/manager/manager";

interface Filter {
    readonly managerId: ManagerId
}
export interface GetCompanyListParams extends GetListParams<Filter> {}
