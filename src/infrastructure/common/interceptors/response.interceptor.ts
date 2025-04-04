import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return this.return(data);
      }),
    );
  }

  return(data: any) {
    if (data?.id) return this.entity(data);
    if (data?.statusCode || data?.message) return this.custom(data);
    if (data?.list) return this.list(data);
    if (data?.generatedMaps?.length >= 0) return this.update(data);
    if (data?.affected !== undefined) return this.delete();
    else return this.default(data);
  }

  custom(data: any) {
    return data;
  }

  default(data: any) {
    let result = data;
    if (Array.isArray(data)) {
      result = {
        list: data,
      };
    }
    return {
      statusCode: 200,
      message: 'SUCCESS',
      data: {
        ...result,
      },
    };
  }

  list(data: Record<'list' | 'total' | 'pages', string[]>) {
    if (!Array.isArray(data.list)) {
      throw new HttpException('data.list is not an array', 500);
    }
    const toReturn: Record<string, any> = {
      statusCode: 200,
      message: 'SUCCESS',
      data: {
        list: data.list,
      },
    };
    if (typeof data?.total === 'number') toReturn.data.total = data.total;
    if (typeof data?.pages === 'number') toReturn.data.pages = data.pages;
    return toReturn;
  }

  delete() {
    return {
      statusCode: 200,
      message: 'DELETED',
    };
  }

  update(data) {
    if (data.affected > 0) {
      return { statusCode: 200, message: 'UPDATED' };
    } else {
      return { statusCode: 400, message: 'ERR_UPDATE' };
    }
  }

  entity(data: any) {
    return { statusCode: 200, message: 'SUCCESS', data: { entity: data } };
  }
}
