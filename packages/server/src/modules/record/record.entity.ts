import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from '../../common/entity/index.js'
@Entity('record')
export class RecordEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  operate_way: string

  @Column()
  operate_type: string

  @Column()
  operator_id: string

  @Column()
  operator_name: string

  @Column()
  operator_ip_address: string

  @Column()
  operate_field: string

  @Column()
  previous_content: string

  @Column()
  current_content: string
}
