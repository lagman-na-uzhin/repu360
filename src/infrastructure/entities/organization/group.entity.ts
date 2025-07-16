import {Column, Entity, JoinColumn, OneToMany, PrimaryColumn} from "typeorm";
import {OrganizationEntity} from "@infrastructure/entities/organization/organization.entity";

@Entity('organization_group')
export class OrganizationGroupEntity {
    @PrimaryColumn("uuid")
    public id: string;

    @Column()
    public organizationId: string;

    @Column()
    public name: string;

    @OneToMany(() => OrganizationEntity, organization => organization.group)
    @JoinColumn({name: 'organization_id'})
    organization: OrganizationEntity;
}
