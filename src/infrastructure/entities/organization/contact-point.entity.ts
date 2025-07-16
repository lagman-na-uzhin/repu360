import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import {ContactPointType} from "@domain/organization/value-objects/contact.point.vo"; // Предполагаемая сущность организации

@Entity('contact_points')
export class ContactPointEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'organization_id' })
    organizationId: string;

    @Column({
        type: 'enum',
        enum: ContactPointType,
        nullable: false,
    })
    type: ContactPointType;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    value: string;

    @ManyToOne(() => OrganizationEntity, organization => organization.contactPoints, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization: OrganizationEntity;
}
