import {Tariff} from "@domain/subscription/model/tariff";

export interface ITariffRepository {
    getById(id: string): Promise<Tariff | null>
}
