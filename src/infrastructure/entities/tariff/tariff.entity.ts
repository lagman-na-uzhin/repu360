import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {PartnerEntity} from "src/infrastructure/entities/ partner/partner.entity";
import {TariffFeaturesEntity} from "src/infrastructure/entities/tariff/tariff-features.entity";

@Entity('tariff')
export class TariffEntity {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    startedAt: Date;

    @Column({ nullable: true })
    partnerId: string;

    @Column()
    isActive: boolean

    @Column({ nullable: true })
    price: number;

    @OneToOne(() => PartnerEntity, (partner) => partner.tariff, { onDelete: 'CASCADE'})
    @JoinColumn({name: "partner_id"})
    partner: PartnerEntity;

    @OneToOne(() => TariffFeaturesEntity, {cascade: ['update', 'insert', 'soft-remove']})
    features: TariffFeaturesEntity;
}
