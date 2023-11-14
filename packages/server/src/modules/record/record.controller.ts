import { Get, Post, Body, Controller, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { RecordListResponse, RecordSearchOptionsResponse } from './record.vo.js'

import type { RecordService } from './record.service.js'
import type { QueryRecordDTO } from './record.dto.js'
import type { RecordListVO, RecordSearchOptionsVO } from './record.vo.js'

@ApiBearerAuth()
@ApiTags('record')
@Controller('record')
@UseGuards(AuthGuard('jwt'))
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @ApiOperation({ summary: '获取操作记录列表页搜索框下拉列表' })
  @ApiOkResponse({
    status: 200,
    description: '返回搜索框下拉列表',
    type: RecordSearchOptionsResponse,
  })
  @Get('get_search_options')
  async getSearchOptions(): Promise<RecordSearchOptionsVO> {
    return await this.recordService.getSearchOptions()
  }

  @ApiOperation({ summary: '获取操作记录' })
  @ApiOkResponse({
    status: 200,
    description: '返回操作记录',
    type: RecordListResponse,
  })
  @Post('get_record_list')
  async getList(@Body() queryRecordDTO: QueryRecordDTO): Promise<RecordListVO> {
    return await this.recordService.getRecordList(queryRecordDTO)
  }
}
