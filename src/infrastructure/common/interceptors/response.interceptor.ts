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
    if (data?.statusCode || data?.message) return this.custom(data);
    if (data?.list !== undefined) return this.list(data); // Changed to check for undefined to be more robust
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

  // --- CORRECTED LIST METHOD ---
  list(data: Record<string, any>) {
    if (!Array.isArray(data.list)) {
      throw new HttpException('data.list is not an array', 500);
    }

    const responseData: Record<string, any> = {
      list: data.list,
    };

    // If meta exists, add it directly to the data object
    if (data?.meta) {
      responseData.meta = data.meta;
    } else {
      // Fallback for cases without a 'meta' object, if needed
      // (You might consider removing this else block if all list responses will have 'meta')
      if (typeof data?.total === 'number') responseData.total = data.total;
      if (typeof data?.pages === 'number') responseData.pages = data.pages;
    }

    return {
      statusCode: 200,
      message: 'SUCCESS',
      data: responseData,
    };
  }
  // --- END OF CORRECTED LIST METHOD ---

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
