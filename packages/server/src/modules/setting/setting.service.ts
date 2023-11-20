import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { SettingEntity } from './setting.entity.js'

import { Extractor } from '../../common/type/index.js'
import {
  extractAllDirPathFromSourceCode,
  reActionResource,
} from '../locale/locale.tool.js'
import { BusinessException } from '../../common/exception/business.exception.js'

import {
  SettingSearchOptionsVO,
  SettingVO,
  UpdateSettingVO,
} from './setting.vo.js'
import { Repository } from 'typeorm'
import { Setting, UpdateSettingDTO } from './setting.dto.js'
import {
  localeDictMap,
  filterExtNameMap,
  extractorMap,
} from './setting.dict.js'

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}

  async getSearchOptions(): Promise<SettingSearchOptionsVO> {
    let resolveDirPathMap = []
    let message: string[] = []

    const settingList = await this.settingRepository.find()
    const setting: Setting = {
      gitRepositoryUrl: '',
      gitAccessUserName: '',
      gitAccessToken: '',
      resolveGitBranchName: '',
      projectDirName: '',
      filterExtNameList: [],
      localeDict: [],
      extractor: Extractor.AST,
      resolveDirPathList: [],
      systemTitle: '',
    }
    settingList.forEach((v) => {
      setting[v['type']] = v['value']
    })

    if (
      setting.gitRepositoryUrl &&
      setting.gitAccessUserName &&
      setting.gitAccessToken &&
      setting.projectDirName &&
      setting.resolveGitBranchName
    ) {
      const execResult = await extractAllDirPathFromSourceCode(
        setting.gitRepositoryUrl,
        setting.gitAccessUserName,
        setting.gitAccessToken,
        setting.projectDirName,
        setting.resolveGitBranchName,
      )

      console.log('execResult', execResult)

      const { success, message: _message, readResult } = execResult

      if (success) {
        resolveDirPathMap = readResult.map((i) => {
          return { label: i, value: i }
        })
        message = _message
      } else {
        throw new BusinessException(`${message.join(',')}`)
      }
    }

    return {
      searchOptions: {
        filterExtNameMap,
        extractorMap,
        resolveDirPathMap,
        localeDictMap,
      },
      message: message,
    }
  }

  async getSetting(): Promise<SettingVO> {
    return this.buildSettingVO()
  }

  async getPublicSetting(): Promise<SettingVO> {
    return this.buildSettingVO(true, true)
  }

  async updateSetting(
    updateSettingDTO: UpdateSettingDTO,
  ): Promise<UpdateSettingVO> {
    const settingObj = updateSettingDTO.setting
    const o = []
    Object.entries(settingObj).forEach(([key, value]) => {
      if (
        key === 'filterExtNameList' ||
        key === 'resolveDirPathList' ||
        key === 'localeDict'
      ) {
        o.push({
          type: key,
          value: value.join(','),
        })
      } else if (key === 'gitAccessToken') {
        if (!value.startsWith('*****')) {
          o.push({
            type: key,
            value: value,
          })
        }
      } else {
        o.push({
          type: key,
          value,
        })
      }
    })

    let isNeedReActionResourece = false

    for (let index = 0; index < o.length; index++) {
      const type = o[index]['type']
      const value = o[index]['value']
      const toUpdate = await this.settingRepository.findOneBy({ type })
      let updated = {}
      if (toUpdate) {
        if (
          [
            'gitRepositoryUrl',
            'gitAccessUserName',
            'gitAccessToken',
            'resolveGitBranchName',
            'projectDirName',
          ].includes(type) &&
          value !== toUpdate.value
        ) {
          isNeedReActionResourece = true
        }

        updated = { ...toUpdate, value }
        await this.settingRepository.save(updated)
      } else {
        if (
          [
            'gitRepositoryUrl',
            'gitAccessUserName',
            'gitAccessToken',
            'resolveGitBranchName',
            'projectDirName',
          ].includes(type)
        ) {
          isNeedReActionResourece = true
        }

        updated = { type, value }
        await this.settingRepository.save(
          Object.assign(new SettingEntity(), updated),
        )
      }
    }

    let message = []

    const { setting } = await this.buildSettingVO(false)

    if (isNeedReActionResourece) {
      const result = await reActionResource(
        setting.gitRepositoryUrl,
        setting.gitAccessUserName,
        setting.gitAccessToken,
        setting.projectDirName,
        setting.resolveGitBranchName,
      )
      message = result.message
    }

    setting['gitAccessToken'] = '********************************'

    return { message: message, setting }
  }

  async getLocaleDictWithLabel(): Promise<any[]> {
    const { setting } = await this.buildSettingVO()
    const { localeDict } = setting
    return localeDict.map((item) => {
      const label = localeDictMap.find((i) => i.value === item)?.label
      return { label, value: item }
    })
  }

  private async buildSettingVO(
    encrypt = true,
    isPublic = false,
  ): Promise<SettingVO> {
    const settingList = await this.settingRepository.find()
    const setting = {}
    settingList.forEach((v) => {
      if (
        v['type'] === 'filterExtNameList' ||
        v['type'] === 'resolveDirPathList' ||
        v['type'] === 'localeDict'
      ) {
        setting[v['type']] = v['value'].split(',')
      } else {
        setting[v['type']] = v['value']
      }
    })

    if (isPublic === true) {
      return { setting: { systemTitle: setting['systemTitle'] } } as SettingVO
    }
    if (encrypt && setting['gitAccessToken']) {
      setting['gitAccessToken'] = '********************************'
    }
    return { setting } as SettingVO
  }
}
