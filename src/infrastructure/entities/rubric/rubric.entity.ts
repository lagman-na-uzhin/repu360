import {Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable} from 'typeorm';
import {ExternalRubricEntity} from "@infrastructure/entities/rubric/external-rubric.entity";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";

@Entity('rubric')
export class RubricEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => ExternalRubricEntity, external => external.rubrics, { eager: true })
    @JoinTable({
        name: 'rubric_external_rubric',
        joinColumn: { name: 'rubric_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'external_rubric_id', referencedColumnName: 'id' }
    })
    external: ExternalRubricEntity[];

    @ManyToMany(() => OrganizationEntity, organization => organization.rubrics)
    @JoinTable({
        name: 'organization_rubric',
        joinColumn: { name: 'rubric_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'organization_id', referencedColumnName: 'id' }
    })
    organization: OrganizationEntity;
}
