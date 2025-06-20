import {CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity('review_complaint')
export class ReviewComplaintEntity {
    @PrimaryColumn("uuid")
    public id: string;


    // @ManyToOne(() => ReviewEntity, (review) => review., { onDelete: 'CASCADE' })
    // review: ReviewEntity


    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
