import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerEntity } from 'src/infrastructure/entities/ partner/partner.entity';
import { Company, PartnerId } from '@domain/company/company';
import { IPartnerRepository } from '@domain/company/repositories/company-repository.interface';
import { PartnerUser } from '@domain/employee/employee';
import { UserEntity } from 'src/infrastructure/entities/user/user.entity';
import { PartnerTariff } from '@domain/subscription/model/tariff';
import { TariffEntity } from 'src/infrastructure/entities/tariff/tariff.entity';
import {PartnerTariffFeatures} from "@domain/subscription/model/tariff-feature";
import {PartnerUserRole} from "@domain/company/value-object/company-manager-role.vo";

@Injectable()
export class PartnerOrmRepository implements IPartnerRepository {
  constructor(
    @InjectRepository(PartnerEntity)
    private readonly repo: Repository<PartnerEntity>,
  ) {}

  async getById(id: string): Promise<Company | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['tariff', 'tariff.features', 'users']
    })
    return entity ? this.toModel(entity) : null;
  }

  async save(partner: Company): Promise<void> {
    console.log(this.toEntity(partner));
    await this.repo.save(this.toEntity(partner))
  }

  private toModel(entity: PartnerEntity): Company {
    const tariff = entity.tariff ? this.toPartnerTariffModel(entity.tariff) : null;
    const users = entity.users.map(this.toPartnerUserModel);
    return Company.fromPersistence(
        entity.id,
        entity.companyName,
        tariff,
        users
    )
  }
  private toPartnerTariffModel(entity: TariffEntity) {
    const features = PartnerTariffFeatures.fromPersistence(
        entity.features.companyDataSync,
        entity.features.cardOptimization,
        entity.features.dataProtection,
        entity.features.reviewCollection,
        entity.features.reviewResponses,
        entity.features.geoServicePosts,
        entity.features.photoManager,
        entity.features.reviewNotifications,
        entity.features.basicReviewAnalytics,
        entity.features.rocketLiteFeatures,
        entity.features.reviewGenerator,
        entity.features.autoResponses,
        entity.features.onlineReputationAnalytics,
        entity.features.advancedPresenceAnalytics,
        entity.features.duplicateAndFakeRemoval,
        entity.features.competitorAnalytics,
    )
    return PartnerTariff.fromPersistence(
        entity.id,
        entity.partnerId,
        entity.isActive,
        entity.price,
        entity.startedAt,
        features
    )
  }
  private toPartnerUserModel(entity: UserEntity) {
    return PartnerUser.fromPersistence(
        entity.id,
        entity.role as unknown as PartnerUserRole,
        entity.partnerId,
        entity.name,
        entity.email,
        entity.phone,
        entity.password,
        entity.avatar
    )
  }

  private toEntity(model: Company): Partial<PartnerEntity> {
    console.log(model.users.map(u => this.toUserEntity(u, model.id)), "model.users.map(u => this.toUserEntity(u, model.id))");
    return {
      id: model.id.toString(),
      companyName: model.companyName,
      users: model.users.map(u => this.toUserEntity(u, model.id)) as UserEntity[],
      tariff: model.tariff
          ? this.toTariffEntity(model.tariff as PartnerTariff) as TariffEntity
          : null,
    };
  }
  private toUserEntity(user: PartnerUser, partnerId: PartnerId): Partial<UserEntity> {
    return {
      id: user.id.toString(),
      name: user.name.toString(),
      email: user.email.toString(),
      phone: user.phone.toString(),
      password: user.password.toString(),
      avatar: user.avatar || null,
      partnerId: partnerId.toString(),
      roleId: user.roleId.toString(),
    };
  }
  private toTariffEntity(tariff: PartnerTariff): Partial<TariffEntity> {
    return {
      id: tariff.id.toString().toString(),
      startedAt: tariff.startedAt,
      partnerId: tariff.partnerId.toString(), //TODO: удалить этот айди из модельки
      price: tariff.price
    }
  }
}
