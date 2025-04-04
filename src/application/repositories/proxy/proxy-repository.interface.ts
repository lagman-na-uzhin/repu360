
export interface IProxy {
    id: number;
    ip: string;
    port: number;
    login: string;
    password: string;
    type: any; //TODO
}
export interface IProxyRepository {
    getById(id: number): Promise<IProxy | null>
}
