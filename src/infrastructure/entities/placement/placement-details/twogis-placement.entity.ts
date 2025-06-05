import {Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('twogis_placement_detail')
export class TwogisPlacementDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ type: 'varchar', unique: true })
    externalId: string;

    @Column()
    type: string;

    @Column()
    placementId: string

    @Column({ nullable: true })
    cabinetLogin: string;

    @Column({ nullable: true })
    cabinetPassword: string;


    @OneToOne(() => OrganizationPlacementEntity)
    @JoinColumn({ name: 'placement_id'})
    platform: OrganizationPlacementEntity;
}
