import {
    Column,
    Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn,
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
    @PrimaryColumn("uuid")
    public id: string;

    @Column({ type: 'text' })
    text: string;

    @Column()
    rating: number;

    @Column()
    profileId: string;

    @Column()
    placementId: string;

    @Column({ type: 'enum', enum: Platform })
    platform: Platform;

    @ManyToOne(() => ProfileEntity, (profile) => profile.reviews)
    @JoinColumn({ name: 'profile_id' })
    profile: ProfileEntity;

    @ManyToOne(() => OrganizationPlacementEntity, placement => placement.reviews)
    @JoinColumn({ name: "placement_id" })
    placement: OrganizationPlacementEntity;

    @OneToOne(
        () => TwogisReviewPlacementDetailEntity,
        {
            cascade: ['insert', 'update', 'soft-remove'],
            eager: true,
            nullable: true
        })
    twogisDetail?: TwogisReviewPlacementDetailEntity | null

    @OneToOne(
        () => YandexReviewPlacementDetailEntity,
        {
            cascade: ['insert', 'update', 'soft-remove'],
            eager: true,
            nullable: true
        })
    yandexDetail?: YandexReviewPlacementDetailEntity | null

    @OneToMany(
        () => ReviewMediaEntity, media => media.review,
        {
            cascade: ['insert', 'update', 'soft-remove'],
            eager: true,
            nullable: true
        })
    media: ReviewMediaEntity[];

    // @OneToMany(() => ReviewComplaintEntity, complaint => complaint.review, { cascade: ['insert', 'update', 'soft-remove'], eager: true} )
    // complaints: ReviewComplaintEntity[]; //TODO перенести возможно в placement detail
}

