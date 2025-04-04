export interface IFilterDto {}

export interface ISort {
    readonly sortBy: string;

    readonly isSortDesc: boolean;
}

export interface IPaginationDto {
    readonly currentPage: number;

    readonly perPage: number;
}

export interface IGetListDto {
    readonly search?: string;
    readonly filter?: IFilterDto;
    readonly pagination: IPaginationDto;
    readonly sort?: ISort;
}

