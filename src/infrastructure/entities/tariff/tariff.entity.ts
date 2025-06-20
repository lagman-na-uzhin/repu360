import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
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




    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
