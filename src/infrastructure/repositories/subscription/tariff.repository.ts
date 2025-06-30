import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, Equal} from "typeorm";
import {ITariffRepository} from "@domain/subscription/repositories/tariff-repository.interface";
import {TariffEntity} from "@infrastructure/entities/tariff/tariff.entity";
import {TariffFeaturesEntity} from "@infrastructure/entities/tariff/tariff-features.entity";
import {TariffFeatures} from "@domain/subscription/model/tariff-feature";
import {Tariff, TariffId} from "@domain/subscription/model/tariff";

@Injectable()
export class TariffOrmRepository implements ITariffRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getById(id: TariffId): Promise<Tariff | null> {
        const entity = await this.manager.getRepository(TariffEntity).findOneBy({id: Equal(id.toString())})
        return entity ? this.toDomain(entity) : null;
    }

    async save(tariff: Tariff): Promise<void> {
        await this.manager.getRepository(TariffEntity).save(this.fromDomain(tariff));
    }

    private fromDomain(tariff: Tariff): TariffEntity {
        const entity = new TariffEntity();
        const featuresEntity = this.toFeaturesPersistence(tariff.features, tariff.id);

        entity.id = tariff.id.toString();
        entity.isActive = tariff.isActive;
        entity.price = tariff.price;
        entity.features = featuresEntity;

        return entity;
    }

    private toFeaturesPersistence(features: TariffFeatures, tariffId: TariffId): TariffFeaturesEntity {
        const entity = new TariffFeaturesEntity();
        entity.tariffId = tariffId.toString();
        entity.companyDataSync = features.companyDataSync;
        entity.multiAccess = features.multiAccess;
        entity.registerPlacement = features.registerPlacement;
        entity.reviewReply = features.reviewReply;
        entity.reviewAutoReply = features.reviewAutoReply;
        entity.reviewComplaint = features.reviewComplaint;
        entity.reviewAutoComplaint = features.reviewAutoComplaint;
        entity.analysisReview = features.analysisReview;
        entity.analysisByRadius = features.analysisByRadius;
        entity.analysisCompetitor = features.analysisCompetitor;
        return entity;
    }

    private toDomain(entity: TariffEntity): Tariff {
        const features = this.toDomainFeatures(entity.features);
        return Tariff.fromPersistence(entity.id, entity.isActive, entity.price, features)
    }

    private toDomainFeatures(entity: TariffFeaturesEntity): TariffFeatures {
        return TariffFeatures.fromPersistence(
            entity.companyDataSync,
            entity.multiAccess,
            entity.registerPlacement,
            entity.reviewReply,
            entity.reviewAutoReply,
            entity.reviewComplaint,
            entity.reviewAutoComplaint,
            entity.analysisReview,
            entity.analysisByRadius,
            entity.analysisCompetitor
        );
    }

}
