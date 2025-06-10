import {CompanyId} from "@domain/company/company";

export interface IProxy {
    id: string;
    ip: string;
    port: number;
    login: string;
    password: string;
    companyId: string | null
}
export interface IProxyRepository {
    getById(id: string): Promise<IProxy | null>;
    getActiveList(): Promise<IProxy[]>;
    getCompanyProxies(companyId: CompanyId): Promise<IProxy[]>;
    getRandomOneShared(): Promise<IProxy | null>;
}
