export interface FilterParams {}

export interface SortParams {
    readonly sortBy: string;
    readonly isSortDesc: boolean;
}

export interface PaginationParams {
    readonly page: number;
    readonly limit: number;
}

export interface GetListParams<F extends FilterParams = FilterParams> {
    readonly pagination: PaginationParams;
    readonly filter?: F;
    readonly search?: string;
    readonly sort?: SortParams;
}
