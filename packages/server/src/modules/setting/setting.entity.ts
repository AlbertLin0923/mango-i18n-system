import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '../../common/entity/index.js'

@Entity('setting')
export class SettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: '' })
  type: string

  @Column({ default: '' })
  value: string
}
