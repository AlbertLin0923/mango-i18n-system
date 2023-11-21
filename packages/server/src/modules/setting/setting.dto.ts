import { IsOptional, IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Extractor } from '../../common/type/index.js'

export class Setting {
  @ApiProperty({
    description: 'git仓库地址',
    example: '',
  })
  @IsOptional()
  @IsString()
  gitRepositoryUrl: string

  @ApiProperty({
    description: '项目GITACCESSUSERNAME',
    example: '',
  })
  @IsOptional()
  @IsString()
  gitAccessUserName: string

  @ApiProperty({
    description: '项目GITACCESSTOKEN',
    example: '',
  })
  @IsOptional()
  @IsString()
  gitAccessToken: string

  @ApiProperty({
    description: '解析的git分支名',
    example: 'develop',
  })
  @IsOptional()
  @IsString()
  resolveGitBranchName: string

  @ApiProperty({
    description: '项目目录名',
    example: 'vue-sell',
  })
  @IsOptional()
  @IsString()
  projectDirName: string

  @ApiProperty({
    description: '解析的文件后缀名',
    isArray: true,
    example: ['.vue', '.js', '.jsx', '.ts', '.tsx'],
  })
  @IsOptional()
  @IsString({ each: true })
  filterExtNameList: string[]

  @ApiProperty({
    description: '系统语言包列表',
    isArray: true,
    example: ['zh-CN', 'en-US'],
  })
  @IsOptional()
  @IsString({ each: true })
  localeDict: string[]

  @ApiProperty({
    description: '代码解析器类型',
    example: 'regex',
  })
  @IsOptional()
  @IsEnum(Extractor)
  extractor: Extractor

  @ApiProperty({
    description: '解析的文件路径列表',
    isArray: true,
    example: ['./web-react/src'],
  })
  @IsOptional()
  @IsString({ each: true })
  resolveDirPathList: string[]

  @ApiProperty({
    description: '系统名称',
    example: 'mango-i18n-system',
  })
  @IsOptional()
  @IsString()
  systemTitle: string
}

export class UpdateSettingDTO {
  @ApiProperty({
    description: '更新的设置信息',
    type: Setting,
  })
  @ValidateNested({ each: true })
  @Type(() => Setting)
  setting: Setting
}
