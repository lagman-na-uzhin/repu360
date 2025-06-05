import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {CompanyId} from "@domain/company/company";

export interface IProxyService {
  // getNextReviewSyncProxy(key: string): Promise<IProxy>;
  // getNextReplySendProxy(key: "proxy-session" | "yandex"): Promise<IProxy>;
  getCompanyIndividualProxy(companyId: CompanyId): Promise<IProxy>;
  getSharedProxy(): Promise<IProxy>;
}
