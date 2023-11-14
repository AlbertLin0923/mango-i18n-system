import { IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LocaleDTO {
  @ApiProperty({
    description: 'zh-CN (简体中文)',
    example: '',
  })
  @IsString()
  @Length(0, 1000)
  'zh-CN': string

  @ApiProperty({
    description: '所属模块',
    example: 'xx系统react版',
  })
  @IsString()
  @Length(0, 10000)
  'modules': string
}

export class AddLocaleDTO extends LocaleDTO {}

export class UpdateLocaleDTO extends LocaleDTO {}
export class DeleteLocaleDTO {
  @ApiProperty({
    description: '删除的中文key',
    example: 'xx系统',
  })
  @IsNotEmpty()
  @IsString()
  @Length(0, 1000)
  readonly 'zh-CN': string
}
