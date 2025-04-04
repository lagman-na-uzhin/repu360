import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";
import {ReviewEntity} from "@infrastructure/entities/review/review.entity";
import { YandexPlacementDetailEntity } from '@infrastructure/entities/placement/placement-details/yandex-placement.entity';
import { TwogisPlacementDetailEntity, } from '@infrastructure/entities/placement/placement-details/twogis-placement.entity';
import {Platform} from "@domain/common/enums/platfoms.enum";

@Entity('organization_placement')
export class OrganizationPlacementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => OrganizationEntity, org => org.placements, {
        onDelete: 'CASCADE'
    })
    organization: OrganizationEntity;

    @Column({ type: 'enum', enum: Platform })
    platform: Platform;

    @OneToMany(() => ReviewEntity, (review) => review.organizationPlacement)
    reviews: ReviewEntity[];

    @OneToOne(() => YandexPlacementDetailEntity, { cascade: ['update', 'insert', 'soft-remove'], nullable: true })
    yandexDetail?: YandexPlacementDetailEntity;

    @OneToOne(() => TwogisPlacementDetailEntity, { cascade: ['update', 'insert', 'soft-remove'], nullable: true })
    twogisDetail?: TwogisPlacementDetailEntity;

}
