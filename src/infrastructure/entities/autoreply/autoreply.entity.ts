import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
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
}
