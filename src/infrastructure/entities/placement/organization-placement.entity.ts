import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, JoinColumn,
} from 'typeorm';
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";
import {ReviewEntity} from "@infrastructure/entities/review/review.entity";
import { YandexPlacementDetailEntity } from '@infrastructure/entities/placement/placement-details/yandex-placement.entity';
import { TwogisPlacementDetailEntity, } from '@infrastructure/entities/placement/placement-details/twogis-placement.entity';
import {Platform} from "@domain/placement/types/platfoms.enum";
import {AutoReplyEntity} from "@infrastructure/entities/autoreply/autoreply.entity";

@Entity('organization_placement')
export class OrganizationPlacementEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column({type: 'uuid'})
    public organizationId: string;

    @Column({ type: 'enum', enum: Platform })
    public platform: Platform;

    @ManyToOne(() => OrganizationEntity, organization => organization.placements)
    organization: OrganizationEntity;

    @OneToMany(() => ReviewEntity, (review) => review.placement, { cascade: ["soft-remove"] })
    reviews: ReviewEntity[];

    @OneToOne(() => YandexPlacementDetailEntity, yandexDetail => yandexDetail.placement, {
        cascade: ['update', 'insert', 'soft-remove'],
        nullable: true,
        eager: true
    })
    yandexDetail?: YandexPlacementDetailEntity;

    @OneToOne(() => TwogisPlacementDetailEntity, twogisDetail => twogisDetail.placement, {
        cascade: ['update', 'insert', 'soft-remove'],
        nullable: true,
        eager: true
    })
    twogisDetail?: TwogisPlacementDetailEntity;

    @OneToOne(() => AutoReplyEntity, autoReply => autoReply.placement, {
        cascade: ['update', 'insert', 'soft-remove'],
        nullable: true
    })
    autoReply?: AutoReplyEntity;





    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;

}
