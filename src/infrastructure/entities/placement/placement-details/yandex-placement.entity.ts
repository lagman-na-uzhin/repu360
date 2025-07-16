import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn, PrimaryColumn
} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('yandex_placement_detail')
export class YandexPlacementDetailEntity {
    @PrimaryColumn({type: "uuid", unique: true})
    placementId: string

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
