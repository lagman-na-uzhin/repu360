import {
    Column, CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn,
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



    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
