
export interface IProxy {
    id: string;
    ip: string;
    port: number;
    login: string;
    password: string;
    type: any; //TODO
}
export interface IProxyRepository {
    getById(id: number): Promise<IProxy | null>;
    getActiveList(type: "reply" | "sync"): Promise<IProxy[]>
}
