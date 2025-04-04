import {OrganizationEntity} from "../organization/organization.entity";
import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { UserEntity } from '@infrastructure/entities/user/user.entity';
import {TariffEntity} from "@infrastructure/entities/tariff/tariff.entity";

@Entity('partner')
export class PartnerEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public companyName: string

    @OneToOne(() => TariffEntity, { cascade: ['insert', 'update', 'soft-remove'] })
    tariff: TariffEntity | null;

    @OneToMany(() => OrganizationEntity, (organization) => organization.partner)
    organizations: OrganizationEntity[]

    @OneToMany(() => UserEntity, (user) => user.partner, { cascade: ['insert', 'update', 'soft-remove'] })
    users: UserEntity[];
}
