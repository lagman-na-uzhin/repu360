import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import * as https from 'https';
import * as tunnel from 'tunnel';
import * as randomUseragent from 'random-useragent';
import {
  DEFAULT_REQUEST_TIMEOUT,
  DEFAULT_RETRIES_AMOUNT,
  ERR_CODE_REQUEST,
  ERR_CODE_RESPONSE,
} from './request.const';
import { RequestDto } from './request.dto';
import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {ERR_REQUEST, RESPONSE_TYPE} from "@application/interfaces/services/request/request.enum";

@Injectable()
export class RequestService {
  async request(
    request: RequestDto | any,
    proxy: IProxy | null,
    retries = DEFAULT_RETRIES_AMOUNT,
  ) {
    console.log('request method')
    return await this.retry(request, proxy, retries);
  }

  async retry(
    request: RequestDto,
    proxy: IProxy | null,
    count: number,
  ) {
    const { axiosConfig } = await this.getModifiedConfig(request);
    try {

      if (proxy) {
        axiosConfig.httpsAgent = tunnel.httpsOverHttp({
          proxy: {
            host: proxy.ip,
            port: proxy.port,
            proxyAuth: `${proxy.login}:${proxy.password}`,
          },
        });
      }
      console.log("before send")
      return await this.send(axiosConfig, request.localConfig?.responseType);
    } catch ({ message }) {
      if (count <= 0 || !RequestService.isRetry(message))
        throw new HttpException(message, 400);

      return await this.retry(request, proxy, count - 1);
    }
  }

  private async send(
    axiosConfig: AxiosRequestConfig,
    responseType = RESPONSE_TYPE.DATA,
  ) {
    console.log("send")
    return await axios({ ...axiosConfig })
      .then((res) => {
        if (responseType === RESPONSE_TYPE.COOKIE) {
          const cookie = res.headers['set-cookie'];
          return cookie ? cookie.join(';') : null;
        }
        if (responseType === RESPONSE_TYPE.RES) {
          return res;
        }
        if (responseType === RESPONSE_TYPE.LOGIN_GET_NAME) {
          let cookie: any = res.headers['set-cookie'];
          cookie = cookie ? cookie.join(';') : null;
          const data = {
            token: cookie,
            fullname: res?.data?.display_name,
          };
          return data;
        }
        return res?.data;
      })
      .catch((err) => {
        if (err?.response) {
          console.log('request.services:err.response', {
            message: err.message,
            date: new Date(),
            request: {
              payload: err.config?.data,
              url: err.config?.url,
              method: err.config?.method,
              headers: err.config?.headers,
              proxy: err.config?.httpsAgent?.proxyOptions,
            },
            response: {
              status: err.response?.status,
              data: err.response?.data,
              headers: err.response?.headers,
            },
          });

          // TODO: return response body as error
          if (err.response?.status === 403) return 403;
          if (err.response?.status === 404) return 404;

          throw new HttpException(
            ERR_CODE_RESPONSE(err.response.status),
            err.response.status,
          );
        }
        if (err?.request) {
          console.log('request.services:err.request', {
            message: err.message,
            date: new Date(),
            request: {
              payload: err.config?.data,
              url: err.config?.url,
              method: err.config?.method,
              headers: err.config?.headers,
              proxy: err.config?.httpsAgent?.proxyOptions,
            },
          });
          throw new HttpException(ERR_CODE_REQUEST(err?.message), 500);
        }

        console.log('request.services:err.unknown', {
          date: new Date(),
          message: err.message,
          error: err,
        });

        throw new HttpException('ERR', 500);
      });
  }

  async getModifiedConfig(config: RequestDto): Promise<any> {
    const { requestConfig, localConfig } = config;

    let modifiedConfig;
    modifiedConfig = requestConfig;

    modifiedConfig.maxRedirects = requestConfig?.maxRedirects || 0;
    modifiedConfig.timeout = requestConfig?.timeout || DEFAULT_REQUEST_TIMEOUT;
    modifiedConfig.withCredentials = true;

    modifiedConfig.headers = {
      ...requestConfig.headers,
      'User-Agent': !requestConfig.headers['User-Agent']
        ? randomUseragent.getRandom()
        : requestConfig.headers['User-Agent'],
    };

    modifiedConfig.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    return {
      axiosConfig: modifiedConfig,
    };
  }

  private static isRetry(err: ERR_REQUEST) {
    return err !== ERR_REQUEST.EXTERNAL_AUTH && err !== ERR_REQUEST.NOT_FOUND;
  }

}
