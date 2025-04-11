import {IProxy} from "@application/interfaces/repositories/proxy/proxy-repository.interface";

export interface IProxyService {
  getNextReviewSyncProxy(key: string): Promise<IProxy>;
}
