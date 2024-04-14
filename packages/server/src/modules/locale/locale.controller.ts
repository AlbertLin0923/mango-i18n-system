import {
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Controller,
  Res,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DeleteResult } from 'typeorm'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import xlsx from 'node-xlsx'
import { Response } from 'express'

import {
  LocaleResponse,
  LocaleListResponse,
  LocaleMapResponse,
} from './locale.vo.js'
import {
  isLegalExcelCellValue,
  formatLocaleStr,
  transformListToMap,
  formatExcelData,
  getCompareLocaleStat,
  getFileExtendName,
  getFileNameWithoutExtendName,
  findStubInLocaleList,
} from './locale.utils.js'
import {
  extractChineseFieldListFromSourceCode,
  extractLocaleFromSourceCode,
} from './locale.tool.js'
import { AddLocaleDTO, UpdateLocaleDTO, DeleteLocaleDTO } from './locale.dto.js'
import { LocaleVO, LocaleListVO, LocaleMapVO } from './locale.vo.js'
import { LocaleService } from './locale.service.js'

import { BusinessException } from '../../common/exception/business.exception.js'
import { User } from '../../common/decorator/user.js'
import { SettingService } from '../setting/setting.service.js'

@ApiBearerAuth()
@ApiTags('locale')
@Controller('locale')
export class LocaleController {
  constructor(
    private readonly localeService: LocaleService,
    private readonly settingService: SettingService,
  ) {}

  @ApiOperation({ summary: '获取字典列表' })
  @ApiOkResponse({
    status: 200,
    description: '返回搜索框下拉列表',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('get_dict')
  async getDict(): Promise<any[]> {
    return await this.settingService.getLocaleDictWithLabel()
  }

  @ApiOperation({ summary: '获取全部语言包' })
  @ApiOkResponse({
    status: 200,
    description: '返回全部语言包,以列表格式',
    type: LocaleListResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('get_locale_list')
  async getLocaleList(): Promise<LocaleListVO> {
    return await this.localeService.getLocaleList()
  }

  @ApiOperation({ summary: '获取全部语言包' })
  @ApiOkResponse({
    status: 200,
    description: '返回全部语言包,以字典格式',
    type: LocaleMapResponse,
  })
  @Get('get_locale_map')
  async getLocaleMap(): Promise<LocaleMapVO> {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting
    const { list } = await this.localeService.getLocaleList()
    const map = transformListToMap(list, localeDict)
    return { map }
  }

  @ApiOperation({ summary: '增加语言包条目' })
  @ApiOkResponse({
    status: 200,
    description: '返回增加的语言包条目',
    type: LocaleResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('add_locale')
  async addLocale(
    @User() user,
    @Body() addLocaleDTO: AddLocaleDTO,
  ): Promise<LocaleVO> {
    return await this.localeService.addLocale(user, addLocaleDTO)
  }

  @ApiOperation({ summary: '更新语言包条目' })
  @ApiOkResponse({
    status: 200,
    description: '返回更新的语言包条目',
    type: LocaleResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('update_locale')
  async updateLocale(
    @User() user,
    @Body() updateLocaleDTO: UpdateLocaleDTO,
  ): Promise<LocaleVO> {
    return await this.localeService.updateLocale(user, updateLocaleDTO)
  }

  @ApiOperation({ summary: '删除语言包条目' })
  @ApiOkResponse({
    status: 200,
    description: '返回删除结果',
    type: DeleteResult,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('delete_locale')
  async deleteLocale(
    @User() user,
    @Body() deleteLocaleDTO: DeleteLocaleDTO,
  ): Promise<DeleteResult> {
    return await this.localeService.deleteLocale(user, deleteLocaleDTO)
  }

  @ApiOperation({ summary: '上传语言包-数据对比和分析' })
  @ApiOkResponse({
    status: 200,
    description: '返回数据对比和分析结果',
    type: '',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('upload_analyze')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAnalyze(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    const fileExtendName = getFileExtendName(file.originalname)
    if (fileExtendName === 'xlsx' || fileExtendName === 'xls') {
      const workSheetsFromBuffer = xlsx.parse(file.buffer)?.[0]?.data
      const heads = workSheetsFromBuffer.shift()

      if (
        !localeDict.every((item, index) => {
          return item === heads[index]
        })
      ) {
        throw new BusinessException('excel文件表头格式不正确', 500)
      }

      const excelList = formatExcelData(workSheetsFromBuffer, localeDict)

      const result = findStubInLocaleList(excelList, localeDict)

      const { list } = await this.localeService.getLocaleList()
      const stat = getCompareLocaleStat(list, excelList, localeDict)

      return res.json({
        code: 200,
        success: true,
        data: {
          stat,
          result,
        },
        msg: '解析成功',
      })
    } else if (fileExtendName === 'json') {
      const { originalname, mimetype, buffer } = file
      if (mimetype !== 'application/json') {
        throw new BusinessException('文件格式不正确', 500)
      }

      const languageCode = localeDict.find((item) => {
        return item === getFileNameWithoutExtendName(originalname)
      })

      if (!languageCode) {
        throw new BusinessException(
          `文件名称不正确,正确的文件名如: ${localeDict.join('/')}`,
          500,
        )
      }

      const dataString = buffer.toString()

      let dataObject = {}

      try {
        dataObject = JSON.parse(dataString)
      } catch (error) {
        console.log(error)
        throw new BusinessException('json文件解析错误', 500)
      }

      const datalist = []

      if (languageCode === 'zh-CN') {
        Object.keys(dataObject).forEach((key) => {
          if (isLegalExcelCellValue(key)) {
            datalist.push({ 'zh-CN': formatLocaleStr(key) })
          }
        })
      } else {
        Object.entries(dataObject).forEach(([key, value]) => {
          if (isLegalExcelCellValue(key) && isLegalExcelCellValue(value)) {
            datalist.push({
              'zh-CN': formatLocaleStr(key),
              [languageCode]: formatLocaleStr(value),
            })
          }
        })
      }

      const { list } = await this.localeService.getLocaleList()

      const stat = getCompareLocaleStat(list, datalist, localeDict)

      return res.json({
        code: 200,
        success: true,
        data: {
          stat,
        },
        msg: '解析成功',
      })
    } else {
      throw new BusinessException('不支持该类文件类型上传', 500)
    }
  }

  @ApiOperation({ summary: '上传语言包-数据上传' })
  @ApiOkResponse({
    status: 200,
    description: '返回上传结果',
    type: '',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('upload_submit')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSubmit(
    @User() user,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    const fileExtendName = getFileExtendName(file.originalname)
    if (fileExtendName === 'xlsx' || fileExtendName === 'xls') {
      const workSheetsFromBuffer = xlsx.parse(file.buffer)
      const data = workSheetsFromBuffer[0].data
      const heads = data.shift()

      if (
        !localeDict.every((item, index) => {
          return item === heads[index]
        })
      ) {
        throw new BusinessException('excel文件表头格式不正确', 500)
      }

      const excelList = formatExcelData(data, localeDict)

      await this.localeService.updateLocaleList(user, excelList)

      return res.json({
        code: 200,
        success: true,
        data: null,
        msg: '上传成功',
      })
    } else if (fileExtendName === 'json') {
      const { originalname, mimetype, buffer } = file
      if (mimetype !== 'application/json') {
        throw new BusinessException('文件格式不正确', 500)
      }

      const languageCode = localeDict.find((item) => {
        return item === getFileNameWithoutExtendName(originalname)
      })

      if (!languageCode) {
        throw new BusinessException(
          `文件名称不正确,正确的文件名如: ${localeDict.join('/')}`,
          500,
        )
      }

      const dataString = buffer.toString()

      let dataObject = {}

      try {
        dataObject = JSON.parse(dataString)
      } catch (error) {
        console.log(error)
        throw new BusinessException('json文件解析错误', 500)
      }

      const list = []

      if (languageCode === 'zh-CN') {
        Object.keys(dataObject).forEach((key) => {
          if (isLegalExcelCellValue(key)) {
            list.push({ 'zh-CN': formatLocaleStr(key) })
          }
        })
      } else {
        Object.entries(dataObject).forEach(([key, value]) => {
          if (isLegalExcelCellValue(key) && isLegalExcelCellValue(value)) {
            list.push({
              'zh-CN': formatLocaleStr(key),
              [languageCode]: formatLocaleStr(value),
            })
          }
        })
      }

      await this.localeService.updateLocaleList(user, list)

      return res.json({
        code: 200,
        success: true,
        msg: '上传文件成功',
      })
    } else {
      throw new BusinessException('不支持该类文件类型上传', 500)
    }
  }

  @ApiOperation({ summary: '从仓库中更新中文key到系统中' })
  @ApiOkResponse({
    status: 200,
    description: '返回中文key的获取和更新结果',
    type: '',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('update_key_list_by_load_source_code')
  async updateKeyListByLoadSourceCode(@User() user, @Res() res: Response) {
    const { setting } = await this.settingService.getSetting()
    const {
      gitRepositoryUrl,
      gitAccessUserName,
      gitAccessToken,
      projectDirName,
      resolveGitBranchName,
      resolveDirPathList,
      filterExtNameList,
      extractor,
    } = setting

    const { success, message, readResult } =
      await extractChineseFieldListFromSourceCode(
        gitRepositoryUrl,
        gitAccessUserName,
        gitAccessToken,
        projectDirName,
        resolveGitBranchName,
        resolveDirPathList,
        filterExtNameList,
        extractor,
      )

    if (success) {
      await this.localeService.updateLocaleList(user, readResult)
      return res.json({
        code: 200,
        success: true,
        message,
      })
    } else {
      throw new BusinessException(`${message?.join(',')}`)
    }
  }

  @ApiOperation({ summary: '从仓库中更新语言包到系统中' })
  @ApiOkResponse({
    status: 200,
    description: '返回语言包的获取和更新结果',
    type: '',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('update_list_by_load_source_code_locale')
  async updateListByLoadSourceCodeLocale(@User() user, @Res() res: Response) {
    const { setting } = await this.settingService.getSetting()
    const {
      gitRepositoryUrl,
      gitAccessUserName,
      gitAccessToken,
      projectDirName,
      resolveGitBranchName,
      localeDict,
    } = setting

    const execResult = await extractLocaleFromSourceCode(
      gitRepositoryUrl,
      gitAccessUserName,
      gitAccessToken,
      projectDirName,
      resolveGitBranchName,
      localeDict,
    )

    const { success, message, readResult } = execResult

    if (success) {
      if (readResult.length) {
        for (let index = 0; index < readResult.length; index++) {
          const element = readResult[index]
          const { fileName, locale } = element
          const list = []
          if (fileName === 'zh-CN') {
            Object.keys(locale).map((key) => {
              if (isLegalExcelCellValue(key)) {
                list.push({ 'zh-CN': key })
              }
            })
          } else {
            Object.entries(locale).map(([key, value]) => {
              if (isLegalExcelCellValue(key) && isLegalExcelCellValue(value)) {
                list.push({ 'zh-CN': key, [fileName]: value })
              }
            })
          }

          await this.localeService.updateLocaleList(user, list)
        }
      }

      return res.json({
        code: 200,
        success: true,
        message: message,
      })
    } else {
      throw new BusinessException(`${message?.join(',')}`)
    }
  }

  // @ApiOperation({
  //   summary: '监听GITLAB web hook地址,以更新仓库的中文key到系统中',
  // })
  // @ApiOkResponse({
  //   status: 200,
  //   description: '返回中文key的获取和更新结果',
  //   type: '',
  // })
  // @Post('monitor_source_code_change')
  // async monitorSourceCodeChange(@Body() body, @Res() res: Response) {
  //   return this.updateKeyListByLoadSourceCode(res);
  // }
}
