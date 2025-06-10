import {
    Column,
    Entity,
    JoinColumn, OneToOne, PrimaryColumn,
} from 'typeorm';
import {ReviewEntity} from "../review.entity";
import {Unique} from "typeorm";


@Entity('twogis_review_placement_detail')
@Unique(['externalId'])
export class TwogisReviewPlacementDetailEntity {
    @PrimaryColumn("uuid")
    reviewId: string;

    @Column()
    externalId: string;

    // @Column()
    // isHidden: boolean;
    //
    // @Column()
    // isRated: boolean;
    //
    // @Column()
    // isVerified: boolean;
    //
    // @Column()
    // dateCreated: boolean;

    @OneToOne(() => ReviewEntity)
    @JoinColumn({name: 'review_id'})
    review: ReviewEntity;
}
