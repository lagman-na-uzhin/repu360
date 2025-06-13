import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
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
}
