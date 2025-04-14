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
    readonly search?: string;
    readonly filter?: F;
    readonly pagination: PaginationParams;
    readonly sort: SortParams;
}
