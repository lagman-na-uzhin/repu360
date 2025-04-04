import {Manager} from "@domain/manager/manager";

export interface IUserRepository {
    getById(id: string): Promise<Manager | null>;
    getByEmail(email: string): Promise<Manager | null>;
}
