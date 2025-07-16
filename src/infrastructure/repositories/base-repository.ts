import {ObjectLiteral, Repository, SelectQueryBuilder} from "typeorm";
import {PaginatedResult} from "@domain/common/repositories/paginated-result.interface";
import {PaginationParams, SortParams} from "@domain/common/repositories/get-list.interface";

export class BaseRepository<Entity extends ObjectLiteral> {
  constructor() {}

  async getList<Domain>(
      qb: SelectQueryBuilder<Entity>,
      mapFn: (entity: Entity) => Domain,
      pagination: PaginationParams,
      sort?: SortParams
  ): Promise<PaginatedResult<Domain>> {
    console.log("get list base repo")
    if (sort) {
      const { direction, sortField } = this.getSort(sort);
      qb.orderBy(`${qb.alias}.${sortField}`, direction);

    }

    const { skip, take } = this.getPagination(pagination);
    qb.skip(skip).take(take);

    const [entities, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / pagination.limit);

    return {
      list: entities.map(mapFn),
      total,
      totalPages,
      currentPage: pagination.page,
      limit: pagination.limit,
    };
  }


  getSort(sort: SortParams) {
    const direction = sort.isSortDesc ? 'DESC' : 'ASC' as 'DESC' | 'ASC';
    const sortField = sort.sortBy.replace(/^-/, '');

    return {direction, sortField}
  }
  getPagination(pagination: PaginationParams) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const skip = (page - 1) * limit;

    return { skip, take: limit };
  }
}
