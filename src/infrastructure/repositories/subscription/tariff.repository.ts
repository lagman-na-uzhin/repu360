import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, Equal} from "typeorm";
import {ITariffRepository} from "@domain/subscription/repositories/tariff-repository.interface";
import {Tariff, TariffId} from "@domain/subscription/model/tariff";

@Injectable()
export class TariffOrmRepository implements ITariffRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getById(id: TariffId): Promise<Tariff | null> {
        return Promise.resolve(undefined);
    }


}
