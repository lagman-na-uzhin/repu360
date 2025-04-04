import { REQUEST_METHOD, RESPONSE_TYPE } from './request.enum';

export interface IRequestConfigHeaders {
   Accept?: string;
  'Content-Type'?: string;
  'User-Agent'?: string;
  'X-Auth-Token'?: string;
  'Accept-Language'?: string;
   'Ya-Client-Host'?: string;
   'Ya-Client-Cookie'?: string;
   'X-Requested-With'?: string;
  Host?: string;
  Referer?: string;
  Origin?: string;
  Cookie?: string;
  Authorization?: string;
}

export interface IRequestConfigDto {
  method: REQUEST_METHOD;
  url: string;
  data?: any;
  params?: any;
  headers: IRequestConfigHeaders;
  readonly timeout?: number;
  withCredentials?: boolean;
  maxRedirects?: number;
  strictSSL?: boolean;
}

export interface IRequestConfigLocalDto {
  responseType?: RESPONSE_TYPE;
}

export interface IRequestDto {
  requestConfig: IRequestConfigDto;
  localConfig: IRequestConfigLocalDto;
  isFile?: boolean;
}
