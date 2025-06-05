import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {IProxyService} from "@application/interfaces/services/proxy/proxy-service.interface";
import {IProxy, IProxyRepository} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {MINUTE} from 'time-constants'
import {CompanyId} from "@domain/company/company";

@Injectable()
export class ProxyService implements IProxyService {
  private proxies: IProxy[] = [];

  constructor(private readonly proxyRepo: IProxyRepository) {}

  @Interval(15 * MINUTE)
  private async updateProxiesList() {
    this.proxies = await this.proxyRepo.getActiveList();
  }

  async getCompanyIndividualProxy(companyId: CompanyId): Promise<IProxy> {

  }

  async getSharedProxy(): Promise<IProxy> {

  }
}
