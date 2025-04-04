import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('yandex_placement_detail')
    export class YandexPlacementDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ type: 'varchar', unique: true })
    externalId: string;

    @Column()
    placementId: string;

    @OneToOne(() => OrganizationPlacementEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'placement_id'})
    platform: OrganizationPlacementEntity;
}
