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

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", nullable: true })
    public updatedAt: Date | null;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    public deletedAt: Date | null;


    @ManyToOne(() => TariffEntity, (tariff) => tariff.id, { eager: true })
    @JoinColumn({ name: "tariff_id" })
    tariff: TariffEntity;

    @ManyToOne(() => CompanyEntity, (company) => company.subscriptions)
    company: CompanyEntity;
}
