import { Get, Post, Body, Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { SettingSearchOptionsResponse, SettingResponse } from './setting.vo.js'
import { SettingService } from './setting.service.js'
import { UpdateSettingDTO } from './setting.dto.js'
import {
  SettingSearchOptionsVO,
  SettingVO,
  UpdateSettingVO,
} from './setting.vo.js'

@ApiBearerAuth()
@ApiTags('setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiOperation({ summary: '获取设置页下拉列表' })
  @ApiOkResponse({
    status: 200,
    description: '返回设置页下拉列表',
    type: SettingSearchOptionsResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('get_search_options')
  async getSearchOptions(): Promise<SettingSearchOptionsVO> {
    return await this.settingService.getSearchOptions()
  }

  @ApiOperation({ summary: '获取公开无权限控制的系统设置信息' })
  @ApiOkResponse({
    status: 200,
    description: '返回公开无权限控制的系统设置信息',
    type: SettingResponse,
  })
  @Get('get_public_setting')
  async getPublicSetting(): Promise<SettingVO> {
    return await this.settingService.getPublicSetting()
  }

  @ApiOperation({ summary: '获取系统设置信息' })
  @ApiOkResponse({
    status: 200,
    description: '返回系统设置信息',
    type: SettingResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('get_setting')
  async getSetting(): Promise<SettingVO> {
    return await this.settingService.getSetting()
  }

  @ApiOperation({ summary: '更新系统设置信息' })
  @ApiOkResponse({
    status: 200,
    description: '返回系统设置信息',
    type: SettingResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('update_setting')
  async updateSetting(
    @Body() updateSettingDTO: UpdateSettingDTO,
  ): Promise<UpdateSettingVO> {
    return await this.settingService.updateSetting(updateSettingDTO)
  }
}
