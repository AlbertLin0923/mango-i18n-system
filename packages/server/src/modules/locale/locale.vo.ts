import { ApiProperty } from '@nestjs/swagger';
import { BaseOkResponse } from '../../common/type';

export class Locale {
  @ApiProperty({
    description: 'zh-CN (简体中文)',
    example: '保存',
  })
  'zh-CN': string;

  @ApiProperty({
    description: '所属模块',
    example: 'xx系统react版',
  })
  'modules': string;

  @ApiProperty({
    description: '创建时间',
    example: 1638512861141,
  })
  create_time: number;

  @ApiProperty({
    description: '更新时间',
    example: 1638512861141,
  })
  update_time: number;

  @ApiProperty({
    description: '版本',
    example: 10,
  })
  version: number;
}

export class LocaleVO {
  @ApiProperty({
    description: '语言包条目',
    type: Locale,
  })
  item: Locale;
}

export class LocaleResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: LocaleVO,
  })
  data: LocaleVO;
}

export class LocaleListVO {
  @ApiProperty({
    description: '所有语言包',
    isArray: true,
    type: Locale,
  })
  list: Locale[];
}

export class LocaleListResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: LocaleListVO,
  })
  data: LocaleListVO;
}

export class LocaleMapVO {
  @ApiProperty({
    description: '所有语言包',
    example: {},
  })
  map: Record<string, unknown>;
}

export class LocaleMapResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: LocaleMapVO,
  })
  data: LocaleMapVO;
}
