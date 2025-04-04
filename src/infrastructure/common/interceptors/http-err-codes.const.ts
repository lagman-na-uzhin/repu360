import { EXCEPTION } from '@domain/common/exceptions/exceptions.const';
import { HttpStatus } from '@nestjs/common';

export const ERROR_HTTP_STATUS_MAP: Record<string, { code: number; status: string }> = {
  'Unauthorized': { //FROM JWT GUARD
    status: EXCEPTION.USER.UNAUTHORIZED,
    code: HttpStatus.UNAUTHORIZED
  },
  'USER_UNAUTHORIZED': {
    status: EXCEPTION.USER.UNAUTHORIZED,
    code: HttpStatus.UNAUTHORIZED
  },
  'USER_NOT_FOUND': {
    status: EXCEPTION.USER.NOT_FOUND,
    code: HttpStatus.NOT_FOUND
  },
  'USER_INCORRECT_EMAIL_OR_PASSWORD': {
    status: EXCEPTION.USER.INCORRECT_EMAIL_OR_PASSWORD,
    code: HttpStatus.UNAUTHORIZED
  },
  'USER_EMAIL_ALREADY_EXIST': {
    status: EXCEPTION.USER.EMAIL_ALREADY_EXIST,
    code: HttpStatus.CONFLICT
  },
  'USER_PHONE_ALREADY_EXIST': {
    status: EXCEPTION.USER.PHONE_ALREADY_EXIST,
    code: HttpStatus.CONFLICT
  }
};
