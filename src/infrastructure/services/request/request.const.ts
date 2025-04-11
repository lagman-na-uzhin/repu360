import {ERR_REQUEST} from "@application/interfaces/services/request/request.enum";

export const ERR_CODE_RESPONSE = (status: number) => {
  const codes = {
    401: ERR_REQUEST.INVALID_GRANT,
  };
  return codes[status] ? codes[status] : ERR_REQUEST.UNKNOWN;
};

export const ERR_CODE_REQUEST = (message: string) => {
  const codes = {
    canceled: ERR_REQUEST.TIMEOUT,
  };

  return codes[message] ? codes[message] : ERR_REQUEST.UNKNOWN;
};

export const DEFAULT_RETRIES_AMOUNT = 5;
export const DEFAULT_REQUEST_TIMEOUT = 10000;
