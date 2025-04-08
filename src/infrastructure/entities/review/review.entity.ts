import {
    Column,
    Entity, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationPlacementEntity } from '@infrastructure/entities/placement/organization-placement.entity';
import { ProfileEntity } from 'src/infrastructure/entities/profile/profile.entity';
import { TwogisReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/twogis-review.entity';
import { YandexReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/yandex-review.entity';
import {Platform} from "@domain/placement/types/platfoms.enum";
import { ReviewMediaEntity } from '@infrastructure/entities/review/review-media.entity';
import {ReviewComplaintEntity} from "@infrastructure/entities/review/complaint/review-complaint.entity";


@Entity('review')
export class ReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'text' })
    text: string;

    @Column()
    rating: number;

    @Column()
    profileId: string;

    @Column()
    organizationPlacementId: string;

    @Column({ type: 'enum', enum: Platform })
    platform: Platform;

    @ManyToOne(() => OrganizationPlacementEntity, (orgPlacement) => orgPlacement.reviews, {
        onDelete: 'CASCADE'
    })
    organizationPlacement: OrganizationPlacementEntity;

    @ManyToOne(() => ProfileEntity, (profile) => profile.reviews, {
        onDelete: 'CASCADE'
    })
    profile: ProfileEntity;

    @OneToOne(() => TwogisReviewPlacementDetailEntity, { cascade: ['insert', 'update', 'soft-remove']})
    twogisDetail?: TwogisReviewPlacementDetailEntity

    @OneToOne(() => YandexReviewPlacementDetailEntity, { cascade: ['insert', 'update', 'soft-remove']})
    yandexDetail?: YandexReviewPlacementDetailEntity

    @OneToMany(() => ReviewMediaEntity, media => media.reviewId, { cascade: ['insert', 'update', 'soft-remove']})
    media: ReviewMediaEntity[];

    @OneToMany(() => ReviewComplaintEntity, complaint => complaint.review, { cascade: ['insert', 'update', 'soft-remove'], eager: true} )
    complaints: ReviewComplaintEntity[]; //TODO перенести возможно в placement detail
}

