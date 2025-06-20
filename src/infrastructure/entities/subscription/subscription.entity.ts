import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import {TariffEntity} from "@infrastructure/entities/tariff/tariff.entity";
import {CompanyEntity} from "@infrastructure/entities/company/company.entity";

@Entity('subscription')
export class SubscriptionEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column({type: "uuid"})
    public companyId: string;

    @Column({type: "uuid"})
    public tariffId: string;

    @Column()
    public isExpire: boolean;

    @Column()
    public price: string;

    @Column({ type: "timestamptz" })
    public start: Date;

    @Column({ type: "timestamptz" })
    public end: Date;

    @Column({ type: "timestamptz", nullable: true })
    public frozenAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;


    @ManyToOne(() => TariffEntity, (tariff) => tariff.id, { eager: true })
    @JoinColumn({ name: "tariff_id" })
    tariff: TariffEntity;

    @ManyToOne(() => CompanyEntity, (company) => company.subscriptions)
    company: CompanyEntity;
}
