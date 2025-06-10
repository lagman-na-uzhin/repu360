import {
    Column, CreateDateColumn, DeleteDateColumn,
    Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { OrganizationPlacementEntity } from '@infrastructure/entities/placement/organization-placement.entity';
import { ProfileEntity } from 'src/infrastructure/entities/profile/profile.entity';
import { TwogisReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/twogis-review.entity';
import { YandexReviewPlacementDetailEntity } from '@infrastructure/entities/review/placement-details/yandex-review.entity';
import {Platform} from "@domain/placement/types/platfoms.enum";
import { ReviewMediaEntity } from '@infrastructure/entities/review/review-media.entity';
import {ReviewComplaintEntity} from "@infrastructure/entities/review/complaint/review-complaint.entity";
import {ReviewReplyEntity} from "@infrastructure/entities/review/review-reply.entity";


@Entity('review')
export class ReviewEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column({ type: 'text' })
    public text: string;

    @Column()
    public rating: number;

    @Column({type: "uuid"})
    public profileId: string;

    @Column({type: "uuid"})
    public placementId: string;

    @Column({ type: 'enum', enum: Platform })
    public platform: Platform;

    @ManyToOne(() => ProfileEntity, (profile) => profile.reviews)
    profile: ProfileEntity;

    @ManyToOne(() => OrganizationPlacementEntity, placement => placement.reviews)
    placement: OrganizationPlacementEntity;

    @OneToOne(
        () => TwogisReviewPlacementDetailEntity,
        twogisDetail => twogisDetail.review,
        {
            cascade: ['insert', 'update', 'soft-remove'],
            eager: true,
            nullable: true
        })
    twogisDetail?: TwogisReviewPlacementDetailEntity | null

    @OneToOne(
        () => YandexReviewPlacementDetailEntity,
        yandexDetail => yandexDetail.review,
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

    @OneToMany(
        () => ReviewReplyEntity, reply => reply.review,
        {
            cascade: ['insert', 'update', 'soft-remove'],
            eager: true,
            nullable: true
        })
    replies: ReviewReplyEntity[];

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz", nullable: true })
    public updatedAt: Date | null;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    public deletedAt: Date | null;

    // @OneToMany(() => ReviewComplaintEntity, complaint => complaint.review, { cascade: ['insert', 'update', 'soft-remove'], eager: true} )
    // complaints: ReviewComplaintEntity[]; //TODO перенести возможно в placement detail
}

