import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('twogis_placement_detail')
export class TwogisPlacementDetailEntity {
    @PrimaryColumn({type: "uuid", unique: true})
    placementId: string;

    @Column({ nullable: true })
    cabinetLogin: string;

    @Column({ nullable: true })
    cabinetPassword: string;

    @OneToOne(() => OrganizationPlacementEntity, placement => placement.twogisDetail)
    @JoinColumn({ name: 'placement_id' })
    placement: OrganizationPlacementEntity;



    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
