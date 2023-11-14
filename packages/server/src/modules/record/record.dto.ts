import { IsOptional, IsString, IsInt } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { TablePaginationType } from '../../common/dto/index.js'
export class RecordDTO {
  @ApiProperty({
    description: '操作方式',
    example: 'add',
  })
  @IsString()
  operate_way: string

  @ApiProperty({
    description: '操作类型',
    example: 'batch',
  })
  @IsString()
  operate_type: string

  @ApiProperty({
    description: '操作的用户的id',
    example: '',
  })
  @IsString()
  operator_id: string

  @ApiProperty({
    description: '操作的用户的名称',
    example: '',
  })
  @IsString()
  operator_name: string

  @ApiProperty({
    description: '操作的用户的使用的ip地址',
    example: '192.0.0.1',
  })
  @IsString()
  operator_ip_address: string

  @ApiProperty({
    description: '操作的字段',
    example: '',
  })
  @IsString()
  operate_field: string

  @ApiProperty({
    description: '操作前内容',
    example: '',
  })
  @IsString()
  previous_content: string

  @ApiProperty({
    description: '操作后内容',
    example: '',
  })
  @IsString()
  current_content: string
}

export class AddRecordDTO extends RecordDTO {}

export class QueryRecordDTO extends TablePaginationType {
  @ApiPropertyOptional({
    description: '操作方式',
    example: 'upload',
  })
  @IsOptional()
  @IsString()
  operate_way?: string

  @ApiPropertyOptional({
    description: '操作类型',
    example: 'add',
  })
  @IsOptional()
  @IsString()
  operate_type?: string

  @ApiPropertyOptional({
    description: '操作时间',
    example: [],
  })
  @IsOptional()
  @IsInt({ each: true })
  create_time?: number[]

  @ApiPropertyOptional({
    description: '操作的用户的id',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  operator_id?: string

  @ApiPropertyOptional({
    description: '操作的用户的名称',
    example: 'andy',
  })
  @IsOptional()
  @IsString()
  operator_name?: string

  @ApiPropertyOptional({
    description: '操作的字段的key',
    example: '',
  })
  @IsOptional()
  @IsString()
  operate_field?: string
}
