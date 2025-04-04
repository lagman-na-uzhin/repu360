import { HttpException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  IPaginationDto,
} from "@domain/common/interfaces/repositories/get-list.interface";
import {IListResponse} from "@domain/common/interfaces/repositories/list-response.interface";


@Injectable()
export class RepositoriesService {
  constructor(private dataSource: DataSource) {}

  async initQueryRunner() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async runQueryRunner(queryRunner, callback) {
    try {
      const result = await callback;
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      console.error('ERR', err);
      await queryRunner.rollbackTransaction();
      throw new HttpException('ERR_TRANSACTION', 500);
    } finally {
      await queryRunner.release();
    }
  }

  pagination({ currentPage, perPage }: IPaginationDto) {
    return {
      offset: currentPage > 0 ? currentPage * perPage - perPage : 0,
      perPage,
    };
  }

  async returningList<T, M>(
      sqlQuery,
      offset: number,
      perPage: number,
      toModel: (entity: T) => M,
  ): Promise<IListResponse<M>> {
    const [list, total] = await Promise.all([
      sqlQuery.offset(offset).limit(perPage).getMany(),
      sqlQuery.getCount(),
    ]);

    return {
      list: list.map(toModel),
      total,
      pages: Math.max(1, Math.ceil(total / perPage)),
    };
  }


  async returningListTakeSkip(
    sqlQuery,
    offset: number,
    perPage: number,
  ): Promise<IListResponse> {
    const list = await sqlQuery.skip(offset).take(perPage).getMany();
    const total = await sqlQuery.getCount();

    const pages = Math.ceil(total / perPage);
    return {
      list: list,
      total: total,
      pages: pages != 0 ? pages : 1,
    };
  }

  getOffset(pagination: IPaginationDto) {
    return pagination.currentPage > 0
      ? pagination.currentPage * pagination.perPage - pagination.perPage
      : 0;
  }
}
