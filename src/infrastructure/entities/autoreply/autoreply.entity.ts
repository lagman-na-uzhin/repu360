import {
    Column, CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import {OrganizationPlacementEntity} from "@infrastructure/entities/placement/organization-placement.entity";

@Entity('auto_reply')
export class AutoReplyEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public isEnabled: boolean;

    @Column({type: 'uuid'})
    public placementId: string;

    @Column({ nullable: true, type: 'time' })
    public startTime: string;

    @Column({ nullable: true, type: 'time' })
    public endTime: string;

    @OneToOne(() => OrganizationPlacementEntity, placement => placement.autoReply)
    @JoinColumn({name: 'placement_id'})
    placement: OrganizationPlacementEntity;






    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
    public deletedAt: Date | null;
}
