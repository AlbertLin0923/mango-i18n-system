import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { SettingEntity } from './setting.entity.js'

import { Extractor } from '../../common/type/index.js'
import {
  extractAllDirPathFromSourceCode,
  reActionResource,
} from '../locale/locale.tool.js'
import { BusinessException } from '../../common/exception/business.exception.js'

import type {
  SettingSearchOptionsVO,
  SettingVO,
  UpdateSettingVO,
} from './setting.vo.js'
import type { Setting, UpdateSettingDTO } from './setting.dto.js'
import type { Repository } from 'typeorm'

const allLocaleDict = [
  {
    fileName: 'zh-CN',
    cnName: '简体中文',
    alias: ['zh-CN', 'zh_CN', 'zh'],
  },
  {
    fileName: 'en-US',
    cnName: '英语',
    alias: ['en-US', 'en_US', 'en'],
  },
  {
    fileName: 'id-ID',
    cnName: '印度尼西亚语',
    alias: ['id-ID', 'id_ID', 'in_ID', 'id'],
  },
  {
    fileName: 'vi-VN',
    cnName: '越南语',
    alias: ['vi-VN', 'vi_VN', 'vi', 'vn'],
  },
  {
    fileName: 'ms-MY',
    cnName: '马来语',
    alias: ['ms-MY', 'ms_MY', 'my', 'ms'],
  },
  {
    fileName: 'es-ES',
    cnName: '西班牙语',
    alias: ['es-ES', 'es_ES'],
  },
  {
    fileName: 'fr-FR',
    cnName: '法语-法国',
    alias: ['fr-FR', 'fr_FR'],
  },
  {
    fileName: 'fr-BE',
    cnName: '法语-比利时',
    alias: ['fr-BE', 'fr_BE'],
  },
  {
    fileName: 'it-IT',
    cnName: '意大利语',
    alias: ['it-IT', 'it_IT'],
  },
  {
    fileName: 'pl-PL',
    cnName: '波兰语',
    alias: ['pl-PL', 'pl_PL'],
  },
  {
    fileName: 'de-DE',
    cnName: '德语',
    alias: ['de-DE', 'de_DE'],
  },
  { fileName: 'da-DK', cnName: '丹麦语', alias: ['da-DK', 'da_DK'] },
  { fileName: 'nl-NL', cnName: '荷兰语', alias: ['nl-NL', 'nl_NL'] },
  { fileName: 'fi-FI', cnName: '芬兰语', alias: ['fi-FI', 'fi_FI'] },
  { fileName: 'el-GR', cnName: '希腊语', alias: ['el-GR', 'el_GR'] },
  { fileName: 'hu-HU', cnName: '匈牙利语', alias: ['hu-HU', 'hu_HU'] },
  { fileName: 'is-IS', cnName: '冰岛语', alias: ['is-IS', 'is_IS'] },
  { fileName: 'ja-JP', cnName: '日语', alias: ['ja-JP', 'ja_JP'] },
  { fileName: 'ko-KR', cnName: '韩语', alias: ['ko-KR', 'ko_KR'] },
  { fileName: 'pt-PT', cnName: '葡萄牙语', alias: ['pt-PT', 'pt_PT'] },
  { fileName: 'sv-SE', cnName: '瑞典语', alias: ['sv-SE', 'sv_SE'] },
  { fileName: 'th-TH', cnName: '泰语', alias: ['th-TH', 'th_TH'] },
].map((i) => {
  return { label: `${i.fileName} (${i.cnName})`, value: i.fileName }
})

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}

  async getSearchOptions(): Promise<SettingSearchOptionsVO> {
    const allFilterExtName = [
      { label: '.vue', value: '.vue' },
      { label: '.js', value: '.js' },
      { label: '.jsx', value: '.jsx' },
      { label: '.ts', value: '.ts' },
      { label: '.tsx', value: '.tsx' },
      { label: '.svelte', value: '.svelte' },
    ]

    const allExtractor = [
      { label: 'regex', value: 'regex' },
      { label: 'ast', value: 'ast' },
    ]

    let allResolveDirPath = []
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

      const { success, message: _message, readResult } = execResult

      if (success) {
        allResolveDirPath = readResult.map((i) => {
          return { label: i, value: i }
        })
        message = _message
      } else {
        throw new BusinessException(`${message.join(',')}`)
      }
    }

    return {
      searchOptions: {
        allFilterExtName,
        allExtractor,
        allResolveDirPath,
        allLocaleDict,
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
      const label = allLocaleDict.find((i) => i.value === item)?.label
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
