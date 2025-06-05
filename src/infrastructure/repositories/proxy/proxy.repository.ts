import { Injectable } from '@nestjs/common';
import {IProxy, IProxyRepository} from "@application/interfaces/repositories/proxy/proxy-repository.interface";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {BaseRepository} from "@infrastructure/repositories/base-repository";
import {CompanyEntity} from "@infrastructure/entities/company/company.entity";

@Injectable()
export class ProxyOrmRepository implements IProxyRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
        private readonly base: BaseRepository<CompanyEntity>
    ) {}

    async getActiveList(type: "reply" | "sync"): Promise<IProxy[]> {
    }

    getById(id: number): Promise<IProxy | null> {
        return Promise.resolve(undefined);
    }

}
