import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import { HttpStatus } from '@nestjs/common';

export const ERROR_HTTP_STATUS_MAP: Record<string, { code: number; status: string }> = {
  'Unauthorized': { //FROM JWT GUARD
    status: EXCEPTION.COMMON.UNAUTHORIZED,
    code: HttpStatus.UNAUTHORIZED
  },
  'EMPLOYEE_UNAUTHORIZED': {
    status: EXCEPTION.EMPLOYEE.UNAUTHORIZED,
    code: HttpStatus.UNAUTHORIZED
  },
  'EMPLOYEE_NOT_FOUND': {
    status: EXCEPTION.EMPLOYEE.NOT_FOUND,
    code: HttpStatus.NOT_FOUND
  },
  'EMPLOYEE_INCORRECT_EMAIL_OR_PASSWORD': {
    status: EXCEPTION.EMPLOYEE.INCORRECT_EMAIL_OR_PASSWORD,
    code: HttpStatus.UNAUTHORIZED
  },
  'EMPLOYEE_EMAIL_ALREADY_EXIST': {
    status: EXCEPTION.EMPLOYEE.EMAIL_ALREADY_EXIST,
    code: HttpStatus.CONFLICT
  },
  'EMPLOYEE_PHONE_ALREADY_EXIST': {
    status: EXCEPTION.EMPLOYEE.PHONE_ALREADY_EXIST,
    code: HttpStatus.CONFLICT
  },
  'PERMISSION_DENIED': {
    status: EXCEPTION.ROLE.PERMISSION_DENIED,
    code: HttpStatus.FORBIDDEN
  },
  'MANAGER_INCORRECT_EMAIL_OR_PASSWORD': {
    status: EXCEPTION.ROLE.PERMISSION_DENIED,
    code: HttpStatus.UNAUTHORIZED
  }
};
