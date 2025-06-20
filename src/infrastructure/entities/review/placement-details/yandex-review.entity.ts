import {
    Column, CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    Unique, UpdateDateColumn,
} from 'typeorm';
import {ReviewEntity} from "../review.entity";


@Entity('yandex_review_placement_detail')
@Unique(['externalId'])
export class YandexReviewPlacementDetailEntity {
    @PrimaryColumn("uuid")
    reviewId: string;

    @Column()
    externalId: string;

    @OneToOne(() => ReviewEntity, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'review_id'})
    review: ReviewEntity;


    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
