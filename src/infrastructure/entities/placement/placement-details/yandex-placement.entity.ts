import {Entity, Column, OneToOne, JoinColumn, PrimaryColumn} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('yandex_placement_detail')
export class YandexPlacementDetailEntity {
    @PrimaryColumn('uuid')
    id: string

    @Column({ type: 'varchar', unique: true })
    externalId: string;

    @Column({type: "uuid"})
    placementId: string;

    @OneToOne(() => OrganizationPlacementEntity, placement => placement.yandexDetail)
    @JoinColumn({ name: 'placement_id'})
    placement: OrganizationPlacementEntity;
}
