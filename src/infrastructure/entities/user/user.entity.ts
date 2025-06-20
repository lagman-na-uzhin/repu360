import {
  Column,
  ManyToOne,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn
} from 'typeorm';
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

  @Column({ nullable: true, type: "uuid"})
  public companyId: string | null;

  @Column({
    unique: true,
    type: "uuid"
  })
  public roleId: string;


  @ManyToOne(() => CompanyEntity, (company) => company.employees )
  @JoinColumn({ name: "company_id" })
  company: CompanyEntity;

  @OneToOne(() => UserRoleEntity, {cascade: ['insert', 'soft-remove', 'update'], eager: true })
  @JoinColumn({name: "role_id"})
  role: UserRoleEntity;





  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  public deletedAt: Date | null;
}
