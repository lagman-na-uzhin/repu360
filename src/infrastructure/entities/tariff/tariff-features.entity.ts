import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import {TariffEntity} from "@infrastructure/entities/tariff/tariff.entity";

@Entity('tariff_features')
export class TariffFeaturesEntity {
    @PrimaryColumn("uuid")
    public tariffId: string;

    @Column()
    companyDataSync: boolean;

    @Column()
    multiAccess: boolean;

    @Column()
    registerPlacement: boolean;

    @Column()
    reviewReply: boolean;

    @Column()
    reviewAutoReply: boolean;

    @Column()
    reviewComplaint: boolean;

    @Column()
    reviewAutoComplaint: boolean;

    @Column()
    analysisReview: boolean;

    @Column()
    analysisByRadius: boolean;

    @Column()
    analysisCompetitor: boolean;

    @OneToOne(() => TariffEntity, tariff => tariff.features)
    @JoinColumn({name: "tariff_id"})
    tariff: TariffEntity;




    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
