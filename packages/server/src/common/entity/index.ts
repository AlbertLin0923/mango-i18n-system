import { Column, VersionColumn, BeforeInsert, BeforeUpdate } from 'typeorm'

export class BaseEntity {
  @Column({ type: 'bigint' })
  create_time: number

  @Column({ type: 'bigint' })
  update_time: number

  @VersionColumn()
  version: number

  @BeforeInsert()
  beforeInsert() {
    this.create_time = new Date().getTime()
    this.update_time = new Date().getTime()
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.update_time = new Date().getTime()
  }
}
