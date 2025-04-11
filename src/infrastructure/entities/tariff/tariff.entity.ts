import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {SubscriptionEntity} from "@infrastructure/entities/subscription/subscription.entity";

@Entity('tariff')
export class TariffEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public isActive: boolean

    @Column({ nullable: true })
    public price: number;

    @OneToMany(() => SubscriptionEntity, subscriptions => subscriptions.tariff, { cascade: ["soft-remove"]})
    subscriptions: SubscriptionEntity[];
}
