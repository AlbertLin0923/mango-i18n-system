import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsString } from 'class-validator';

import { BaseEntity } from '../../common/entity';

export type RoleType = 'user' | 'admin';

export type AccountStatusType = 'normal' | 'freeze';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: 'user' })
  role: RoleType;

  @Column({ default: 'normal' })
  account_status: AccountStatusType;

  @Column()
  @IsString()
  creator: string;
}
