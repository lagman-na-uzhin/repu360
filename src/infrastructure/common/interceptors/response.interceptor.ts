import {
  CallHandler,
  ExecutionContext,
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
    return this.default(data);
  }

  custom(data: any) {
    return data;
  }

  default(data: any) {
    let result = data;
    return {
      statusCode: 200,
      message: 'SUCCESS',
      data: {
        ...result,
      },
    };
  }
}
