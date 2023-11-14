import { Entity, Column, PrimaryColumn } from 'typeorm'

import { BaseEntity } from '../../common/entity/index.js'

@Entity('locale')
export class LocaleEntity extends BaseEntity {
  @PrimaryColumn({
    length: 1000,
    unique: true,
  })
  'zh-CN': string

  @Column({
    length: 1000,
    default: '',
  })
  'en-US': string

  @Column({
    length: 1000,
    default: '',
  })
  'id-ID': string

  @Column({
    length: 1000,
    default: '',
  })
  'vi-VN': string

  @Column({
    length: 1000,
    default: '',
  })
  'ms-MY': string

  @Column({
    length: 1000,
    default: '',
  })
  'es-ES': string

  @Column({
    length: 1000,
    default: '',
  })
  'fr-FR': string

  @Column({
    length: 1000,
    default: '',
  })
  'fr-BE': string

  @Column({
    length: 1000,
    default: '',
  })
  'it-IT': string

  @Column({
    length: 1000,
    default: '',
  })
  'pl-PL': string

  @Column({
    length: 1000,
    default: '',
  })
  'de-DE': string

  @Column({
    length: 1000,
    default: '',
  })
  'da-DK': string

  @Column({
    length: 1000,
    default: '',
  })
  'nl-NL': string

  @Column({
    length: 1000,
    default: '',
  })
  'fi-FI': string

  @Column({
    length: 1000,
    default: '',
  })
  'el-GR': string

  @Column({
    length: 1000,
    default: '',
  })
  'hu-HU': string

  @Column({
    length: 1000,
    default: '',
  })
  'is-IS': string

  @Column({
    length: 1000,
    default: '',
  })
  'ja-JP': string

  @Column({
    length: 1000,
    default: '',
  })
  'ko-KR': string

  @Column({
    length: 1000,
    default: '',
  })
  'pt-PT': string

  @Column({
    length: 1000,
    default: '',
  })
  'sv-SE': string

  @Column({
    length: 1000,
    default: '',
  })
  'th-TH': string

  @Column({
    length: 10000,
    default: '',
  })
  'modules': string
}
