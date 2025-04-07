import {Column, Entity, Unique} from 'typeorm';

@Entity('organization')
@Unique(['organizationId', 'employeeId'])
export class AccessOrganizationEmployeesEntity {
    @Column()
    organizationId: string;

    @Column()
    employeeId: string;
}
