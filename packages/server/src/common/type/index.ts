import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

import { Type } from '@nestjs/common'
export type ObjectLiteral = Record<string, any>

export enum Extractor {
  AST = 'ast',
  REGEX = 'regex',
}
export class BaseOkResponse {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number

  @ApiProperty({ description: '请求状态值', example: true })
  success: boolean

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  message: string
}
export class TablePaginationType {
  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  @IsInt()
  readonly pageSize: number

  @ApiProperty({
    description: '页码',
    example: 1,
  })
  @IsInt()
  readonly page: number
}

// -------------暂时用不到------------

interface SwaggerProp {
  summary: string
  status?: number
  description?: string
  type: Type<any>
}

export function SwaggerVO(arg: SwaggerProp) {
  const { summary, status = 200, description = '', type } = arg

  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ status, description, type }),
  )
}
