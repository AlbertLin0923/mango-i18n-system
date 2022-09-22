import { ApiProperty } from '@nestjs/swagger';
import { RecordEntity } from './record.entity';
import { BaseOkResponse } from '../../common/type';

export class Record extends RecordEntity {
  @ApiProperty({
    description: 'id',
    example: '',
  })
  id: string;

  @ApiProperty({
    description: '操作方式',
    example: 'add',
  })
  operate_way: string;

  @ApiProperty({
    description: '操作类型',
    example: 'batch',
  })
  operate_type: string;

  @ApiProperty({
    description: '操作时间',
    example: 1638514395655,
  })
  create_time: number;

  @ApiProperty({
    description: '操作的用户的id',
    example: '',
  })
  operator_id: string;

  @ApiProperty({
    description: '操作的用户的名称',
    example: '',
  })
  operator_name: string;

  @ApiProperty({
    description: '操作的用户使用的ip地址',
    example: '',
  })
  operator_ip_address: string;

  @ApiProperty({
    description: '操作的字段',
    example: '',
  })
  operate_field: string;

  @ApiProperty({
    description: '操作前内容',
    example: '',
  })
  previous_content: string;

  @ApiProperty({
    description: '操作后内容',
    example: '',
  })
  current_content: string;
}

export class RecordVO {
  @ApiProperty({
    description: '语言包条目',
    type: Record,
  })
  item: Record;
}

export class RecordResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: RecordVO,
  })
  data: RecordVO;
}

export class RecordListVO {
  @ApiProperty({
    description: '操作记录列表',
    isArray: true,
    type: Record,
  })
  list: Record[];

  @ApiProperty({
    description: '操作记录列表总数量',
    example: 1000,
  })
  total: number;
}

export class RecordListResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: RecordListVO,
  })
  data: RecordListVO;
}

export class RecordSearchOptionsVO {
  @ApiProperty({
    description: '操作方式下拉列表',
    example: '',
  })
  operateWayMap: Array<{ label: string; value: string }>;

  @ApiProperty({
    description: '操作类型下拉列表',
    example: '',
  })
  operateTypeMap: Array<{ label: string; value: string }>;

  @ApiProperty({
    description: '操作人下拉列表',
    example: '',
  })
  operatorNameMap: Array<{ label: string; value: string }>;
}

export class RecordSearchOptionsResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: RecordSearchOptionsVO,
  })
  data: RecordSearchOptionsVO;
}
