import { Injectable } from '@nestjs/common';
import {IProxy, IProxyRepository} from "@application/interfaces/services/proxy/proxy-repository.interface";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, Equal} from "typeorm";
import {ProxyEntity} from "@infrastructure/entities/proxy/proxy.entity";
import {CompanyId} from "@domain/company/company";

@Injectable()
export class ProxyOrmRepository implements IProxyRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getById(id: string): Promise<IProxy | null> {
        return this.manager.getRepository(ProxyEntity).findOneBy({id: Equal(id)})
    }

    async getActiveList(): Promise<IProxy[]> {
        return this.manager.getRepository(ProxyEntity).find({
            where: {
                isBlocked: false
            }
        })
    }

    async getCompanyProxies(companyId: CompanyId): Promise<IProxy[]> {
        return this.manager
            .getRepository(ProxyEntity)
            .createQueryBuilder('proxy')
            .where('proxy.isBlocked = false')
            .andWhere('proxy.companyId = :companyId', { companyId: companyId.toString() })
            .orderBy('proxy.id', 'ASC')
            .getMany();
    }

    async getRandomOneShared(): Promise<IProxy | null> {
        return this.manager
            .getRepository(ProxyEntity)
            .createQueryBuilder('proxy')
            .where('proxy.isBlocked = false')
            .andWhere('proxy.companyId IS NULL')
            .orderBy('RANDOM()')
            .getOne();
    }
}
