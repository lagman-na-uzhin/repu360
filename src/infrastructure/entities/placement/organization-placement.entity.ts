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

    @Column()
    public organizationId: string;

    @Column({ type: 'enum', enum: Platform })
    public platform: Platform;

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", nullable: true })
    public updatedAt: Date | null;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    public deletedAt: Date | null;


    @ManyToOne(() => OrganizationEntity, organization => organization.placements)
    @JoinColumn({ name: "organization_id" })
    organization: OrganizationEntity;

    @OneToMany(() => ReviewEntity, (review) => review.placement, { cascade: ["soft-remove"] })
    reviews: ReviewEntity[];

    @OneToOne(() => YandexPlacementDetailEntity, { cascade: ['update', 'insert', 'soft-remove'], nullable: true, eager: true })
    yandexDetail?: YandexPlacementDetailEntity;

    @OneToOne(() => TwogisPlacementDetailEntity, { cascade: ['update', 'insert', 'soft-remove'], nullable: true, eager: true })
    twogisDetail?: TwogisPlacementDetailEntity;

    @OneToOne(() => AutoReplyEntity, autoReply => autoReply.placement)
    autoReply: AutoReplyEntity;

}
