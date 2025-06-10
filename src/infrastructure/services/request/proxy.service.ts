import { Injectable } from '@nestjs/common';
import {IProxyService} from "@application/interfaces/services/proxy/proxy-service.interface";
import {IProxy, IProxyRepository} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {CompanyId} from "@domain/company/company";
import {ICacheRepository} from "@application/interfaces/repositories/cache/cache-repository.interface";
import {ProxyOrmRepository} from "@infrastructure/repositories/proxy/proxy.repository";
import {CacheRepository} from "@infrastructure/repositories/cache/cache.repository";

@Injectable()
export class ProxyService implements IProxyService {
  constructor(
      private readonly proxyRepo: ProxyOrmRepository,
      private readonly cacheRepo: CacheRepository
      ) {}

  async getCompanyIndividualProxy(companyId: CompanyId): Promise<IProxy | null> {
    const companyProxies = await this.proxyRepo.getCompanyProxies(companyId);
    console.log(companyProxies, "companyProxies")

    for (const proxy of companyProxies) {
      const hasCooldown = await this.cacheRepo.hasProxyCooldown(proxy.id);
      if (!hasCooldown) return proxy;
    }

    return null;
  }


  async getSharedProxy(): Promise<IProxy | null> {
    return this.proxyRepo.getRandomOneShared();
  }
}
