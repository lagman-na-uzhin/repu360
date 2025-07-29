import {IProxy} from "@application/interfaces/services/proxy/proxy-repository.interface";
import {CompanyId} from "@domain/company/company";

export interface IProxyService {
  // getNextReviewSyncProxy(key: string): Promise<IProxy>;
  // getNextReplySendProxy(key: "proxy-session" | "yandex"): Promise<IProxy>;
  getCompanyIndividualProxy(companyId: CompanyId): Promise<IProxy | null>;
  getSharedProxy(): Promise<IProxy | null>;
}
