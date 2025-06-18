import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { WinstonService } from '@infrastructure/services/logger/winston.service';
import { ERROR_HTTP_STATUS_MAP } from '@infrastructure/common/interceptors/http-err-codes.const';

interface IError {
  status: string;
  code: number;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const actor = request.actor ?? '';
    const combinedData = {
      ...request.body,
      ...request.query,
    };

    const mappedToHTTPError: { code: number; status: string } =
        ERROR_HTTP_STATUS_MAP[exception.message] || {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'SERVER_ERROR',
          message: exception.message
        };

    this.logMessage(
        actor,
        combinedData,
        request,
        mappedToHTTPError,
        mappedToHTTPError.status,
        exception,
    );

    response.status(mappedToHTTPError.code).send(mappedToHTTPError);
  }


  private logMessage(
      actor: any,
    combinedData: any,
    request: any,
    responseData: IError,
    status: string,
    exception: any,
  ) {
    const logData = {
      time: new Date().toISOString(),
      level: 'ERROR',
      method: request.method,
      actor,
      payload: { ...combinedData },
      status: status,
      exception: exception,
      msg: responseData,
      path: request.url,
    };

    if (logData.payload && logData.payload.payload) {
      const payload = logData.payload.payload;
      logData.actor = payload.ownerId;
    }

    this.logger.logTest(logData, logData.payload.reqId);
  }
}
