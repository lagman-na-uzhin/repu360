import {IProxy} from "@application/repositories/proxy/proxy-repository.interface";

export interface IProxyService {
  getNextReviewSyncProxy(key: string): Promise<IProxy>;
}
