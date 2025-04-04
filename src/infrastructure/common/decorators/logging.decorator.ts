

// Для schedule
import { WinstonService } from '@infrastructure/services/logger/winston.service';

export function LogMethodScheduler(name: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const logger = new WinstonService();
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const newReqId = genReqId();
      if (args.length) {
        const payload = Object.assign(args[0]);
        logger.logTest({ payload: payload, path: name }, newReqId);
      } else {
        logger.logTest(
          { method: 'Scheduler', payload: {}, path: name },
          newReqId,
        );
      }
      this.requestId = newReqId;

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

// Для обычных логов usecase
export function LogMethod(name: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const logger = new WinstonService();
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      let payload = {};
      if (args.length) payload = Object.assign(args[0]);
      const newReqId = findReqId(payload) ?? genReqId();

      logger.logTest({ payload: payload, path: name }, newReqId);
      this.requestId = newReqId;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

// Для Background задач
export function LogMethodBackground(name: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const logger = new WinstonService();
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      let payload = {};
      if (args.length) payload = Object.assign(args[0]);
      const newReqId = findReqId(payload) ?? genReqId();

      logger.logTest({ payload: payload, path: name }, newReqId);
      this.requestId = newReqId;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

function genReqId(): string {
  return (
    '' +
    (Math.floor(new Date().getTime() / 1000) + Math.round(Math.random() * 9999))
  );
}

function findReqId(obj: any) {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (key === 'reqId') {
        return obj[key];
      } else if (typeof obj[key] === 'object') {
        const reqId = findReqId(obj[key]);
        if (reqId !== undefined) {
          return reqId;
        }
      }
    }
  }
}
