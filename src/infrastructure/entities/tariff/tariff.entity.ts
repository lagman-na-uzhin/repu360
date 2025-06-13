import {Column, Entity, OneToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {SubscriptionEntity} from "@infrastructure/entities/subscription/subscription.entity";
import {TariffFeaturesEntity} from "@infrastructure/entities/tariff/tariff-features.entity";

@Entity('tariff')
export class TariffEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public isActive: boolean

    @Column({ nullable: true })
    public price: number;

    @OneToOne(() => TariffFeaturesEntity, features => features.tariff, { cascade: ["soft-remove", "insert", "update"], eager: true})
    features: TariffFeaturesEntity;

    @OneToMany(() => SubscriptionEntity, subscriptions => subscriptions.tariff, { cascade: ["soft-remove"]})
    subscriptions: SubscriptionEntity[];
}
