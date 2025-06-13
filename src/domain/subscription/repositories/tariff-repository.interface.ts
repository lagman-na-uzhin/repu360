import {Tariff, TariffId} from "@domain/subscription/model/tariff";

export interface ITariffRepository {
    getById(id: TariffId): Promise<Tariff | null>;
    save(tariff: Tariff): Promise<void>;
}
