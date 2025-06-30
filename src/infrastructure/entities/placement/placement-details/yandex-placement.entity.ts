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

@Entity('yandex_placement_detail')
export class YandexPlacementDetailEntity {
    @PrimaryColumn({ type: 'varchar', unique: true })
    externalId: string;

    @Column({type: "uuid"})
    placementId: string;

    @OneToOne(() => OrganizationPlacementEntity, placement => placement.yandexDetail)
    @JoinColumn({ name: 'placement_id'})
    placement: OrganizationPlacementEntity;




    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
