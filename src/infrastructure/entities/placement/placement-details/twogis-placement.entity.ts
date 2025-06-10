import {Entity, Column, OneToOne, JoinColumn, PrimaryColumn} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('twogis_placement_detail')
export class TwogisPlacementDetailEntity {
    @PrimaryColumn('uuid')
    id: string

    @Column({ type: 'varchar', unique: true })
    externalId: string;

    @Column()
    type: string;

    @Column({type: "uuid"})
    placementId: string

    @Column({ nullable: true })
    cabinetLogin: string;

    @Column({ nullable: true })
    cabinetPassword: string;

    @OneToOne(() => OrganizationPlacementEntity, placement => placement.twogisDetail)
    @JoinColumn({ name: 'placement_id' })
    placement: OrganizationPlacementEntity;
}
