import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    Unique,
} from 'typeorm';
import {ReviewEntity} from "../review.entity";


@Entity('yandex_review_placement_detail')
@Unique(['externalId'])
export class YandexReviewPlacementDetailEntity {
    @PrimaryColumn()
    reviewId: string;

    @Column()
    externalId: string;

    @OneToOne(() => ReviewEntity, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'review_id'})
    review: ReviewEntity;
}
