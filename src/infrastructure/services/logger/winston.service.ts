import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
const { combine, timestamp, printf } = winston.format;

@Injectable()
export class WinstonService {
  private readonly Logger = winston.createLogger({
    format: combine(
      timestamp(),
      printf(({ level, message, timestamp }) => {
        try {
          const { reqId, userId, path, payload, method, msg } =
            JSON.parse(message as string);
          let usefullPayload = payload.authId || payload?.payload?.authId;

          deleteProperties(payload, [
            'authId',
            'partnerId',
            'authRole',
            'ownerId',
          ]);
          if (payload?.query) {
            deleteProperties(payload.query, [
              'authId',
              'partnerId',
              'authRole',
              'ownerId',
            ]);
          }
          if (payload?.payload) {
            deleteProperties(payload.payload, [
              'authId',
              'partnerId',
              'authRole',
              'ownerId',
            ]);
          }

          const msgLogs = JSON.stringify(msg || '').replace(/[^\w\s]/g, '');
          return `{ "level": "${level.toUpperCase()}", "time" : "${timestamp}", "method": "${
            method || ''
          }", "reqId" : "${reqId}", "userId": "${usefullPayload || ''}", "payload" : ${JSON.stringify(
            payload.payload || payload,
          )}, "msg": "${msgLogs}", "path": "${path}"}`;
        } catch (error) {
          return `{ "level": "INFO", "time" : ${timestamp}, "payload": "{}", "msg": "${message}" }`;
        }
      }),
    ),
    transports: [new winston.transports.Console()],
  });

  log(message: string, reqId: string = genReqId()) {
    this.Logger.log('info', message, { reqId });
  }

  warn(message: string, reqId: string = genReqId()) {
    this.Logger.warn('info', message, { reqId });
  }

  logTest(
    obj: { payload: any; path: any; method?: any },
    reqId: string = genReqId(),
    userId?: any,
  ) {
    const logObject = Object.assign({ reqId, userId, ...obj });
    if (logObject.level && logObject.level === 'ERROR')
      this.Logger.log('error', JSON.stringify(logObject));
    else this.Logger.log('info', JSON.stringify(logObject));

    return reqId;
  }

  error(error: Error, message: string) {
    this.Logger.error(JSON.stringify({ message }), error);
  }
}

function genReqId(): string {
  return (
    '' +
    (Math.floor(new Date().getTime() / 1000) + Math.round(Math.random() * 9999))
  );
}

function deleteProperties(obj, propsToDelete) {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        deleteProperties(obj[key], propsToDelete);
      }
    }
  }
  propsToDelete.forEach((prop) => delete obj[prop]);
}
