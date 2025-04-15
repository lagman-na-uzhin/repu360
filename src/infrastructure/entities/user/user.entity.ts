import {PrimaryGeneratedColumn, Column, ManyToOne, Entity, OneToOne, JoinColumn, PrimaryColumn} from 'typeorm';
import { CompanyEntity } from '@infrastructure/entities/company/company.entity';
import {UserRoleEntity} from "@infrastructure/entities/user/access/user-role.entity";

@Entity('user')
export class UserEntity {
  @PrimaryColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({
    unique: true,
  })
  public email: string;

  @Column({
    unique: true,
  })
  public phone: string;

  @Column({nullable: true})
  public password: string;

  @Column({ nullable: true, type: 'text' })
  public avatar: string | null;

  @Column({ nullable: true })
  public companyId: string;


  @ManyToOne(() => CompanyEntity, (company) => company.employees )
  @JoinColumn({ name: "company_id" })
  company: CompanyEntity;

  @OneToOne(() => UserRoleEntity, {cascade: ['insert', 'soft-remove', 'update'], eager: true })
  role: UserRoleEntity;
}
