import { ApiProperty } from '@nestjs/swagger'

import { Setting } from './setting.dto.js'

import { BaseOkResponse } from '../../common/type/index.js'

export class SettingVO {
  @ApiProperty({
    description: '返回系统的设置数据',
    type: Setting,
  })
  setting: Setting
}

export class SettingResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: SettingVO,
  })
  data: SettingVO
}

export class UpdateSettingVO {
  @ApiProperty({
    description: '操作信息',
    isArray: true,
  })
  message: string[]

  @ApiProperty({
    description: '返回系统的设置数据',
    type: Setting,
  })
  setting: Setting
}

export class UpdateSettingResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: UpdateSettingVO,
  })
  data: UpdateSettingVO
}

export class SettingSearchOptionsVO {
  @ApiProperty({
    description: '解析的文件后缀名下拉列表',
    example: '',
  })
  searchOptions: {
    allFilterExtName: { label: string; value: string }[]
    allExtractor: { label: string; value: string }[]
    allResolveDirPath: { label: string; value: string }[]
    allLocaleDict: { label: string; value: string }[]
  }
  message: string[]
}

export class SettingSearchOptionsResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: SettingSearchOptionsVO,
  })
  data: SettingSearchOptionsVO
}
