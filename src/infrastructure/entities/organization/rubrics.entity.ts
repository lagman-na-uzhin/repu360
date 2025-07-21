import {Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Unique} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('organization_rubrics')
@Unique(['organizationId', "alias"])
export class OrganizationRubricsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'organization_id' })
    organizationId: string;

    @Column()
    alias: string;

    @Column()
    name: string;

    @Column({type: 'varchar'})
    type: "primary" | "additional";


    @ManyToOne(() => OrganizationEntity, organization => organization.rubrics, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization: OrganizationEntity;
}
