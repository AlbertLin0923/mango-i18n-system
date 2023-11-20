import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

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
