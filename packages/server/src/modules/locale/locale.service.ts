import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEqual } from 'lodash-es'

import { BusinessException } from '../../common/exception/business.exception.js'

import { LocaleEntity } from './locale.entity.js'
import { transformListToObj, completeLocaleItem } from './locale.utils.js'

import { Repository, DeleteResult } from 'typeorm'
import { AddLocaleDTO, UpdateLocaleDTO, DeleteLocaleDTO } from './locale.dto.js'
import { LocaleListVO, LocaleVO } from './locale.vo.js'
import { RecordService } from '../record/record.service.js'
import { SettingService } from '../setting/setting.service.js'

@Injectable()
export class LocaleService {
  constructor(
    @InjectRepository(LocaleEntity)
    private readonly localeRepository: Repository<LocaleEntity>,
    private readonly recordService: RecordService,
    private readonly settingService: SettingService,
  ) {}

  async getLocaleList(): Promise<LocaleListVO> {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    const list = await this.localeRepository.find({
      order: { create_time: 'DESC' },
    })

    const result = list.map((i) => {
      const n = {
        'zh-CN': i['zh-CN'],
        modules: i['modules'],
        create_time: i['create_time'],
        update_time: i['update_time'],
        version: i['version'],
      }
      localeDict.forEach((it) => {
        n[it] = i[it]
      })
      return n
    })
    return { list: result }
  }

  async addLocale(user, addLocaleDTO: AddLocaleDTO): Promise<LocaleVO> {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    const key = addLocaleDTO['zh-CN']
    const Locale = await this.localeRepository.findOneBy({ 'zh-CN': key })
    if (Locale) {
      throw new BusinessException('该中文key已经存在，请勿重复添加')
    }
    const added = await this.localeRepository.save(
      Object.assign(new LocaleEntity(), addLocaleDTO),
    )

    // 增加操作记录
    const _added = completeLocaleItem(added, localeDict)
    const record = {
      operate_way: 'single',
      operate_type: 'add',
      operator_id: user.userId,
      operator_name: user.username,
      operator_ip_address: user.ip_address,
      operate_field: key,
      previous_content: JSON.stringify({}),
      current_content: JSON.stringify(_added),
    }
    await this.recordService.addRecord(record)

    return { item: added }
  }

  async updateLocale(user, update: UpdateLocaleDTO): Promise<LocaleVO> {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    const key = update['zh-CN']

    if (!key) {
      throw new BusinessException('缺少必要的参数 zh-CN')
    }

    const toUpdate = await this.localeRepository.findOneBy({ 'zh-CN': key })

    // 增加操作记录
    const _update = completeLocaleItem(update, localeDict)
    const _toUpdate = completeLocaleItem(toUpdate, localeDict)
    const _updated = completeLocaleItem(
      { ..._toUpdate, ..._update },
      localeDict,
    )
    const isEqualData = isEqual(_update, _toUpdate)

    if (!isEqualData) {
      const record = {
        operate_way: 'single',
        operate_type: 'modify',
        operator_id: user.userId,
        operator_name: user.username,
        operator_ip_address: user.ip_address,
        operate_field: key,
        previous_content: JSON.stringify(_toUpdate),
        current_content: JSON.stringify(_updated),
      }
      await this.recordService.addRecord(record)
    }

    const updated = await this.localeRepository.save(
      Object.assign(toUpdate, update),
    )

    return { item: updated }
  }

  async deleteLocale(user, data: DeleteLocaleDTO): Promise<DeleteResult> {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    const key = data['zh-CN']
    if (!key) {
      throw new BusinessException('缺少参数 zh-CN')
    }

    // 增加操作记录
    const toDelete = await this.localeRepository.findOneBy({ 'zh-CN': key })
    const _toDeleted = completeLocaleItem(toDelete, localeDict)
    const record = {
      operate_way: 'single',
      operate_type: 'delete',
      operator_id: user.userId,
      operator_name: user.username,
      operator_ip_address: user.ip_address,
      operate_field: key,
      previous_content: JSON.stringify(_toDeleted),
      current_content: JSON.stringify({}),
    }
    await this.recordService.addRecord(record)

    return await this.localeRepository.delete({ 'zh-CN': key })
  }

  async updateLocaleList(user, updateList): Promise<LocaleListVO> {
    const { setting } = await this.settingService.getSetting()
    const { localeDict } = setting

    // 增加操作记录
    const toUpdateKeyList = updateList.map((it) => {
      return it['zh-CN']
    })

    const toUpdateList = await this.localeRepository
      .createQueryBuilder('locale')
      .where('locale.zh-CN IN (:...toUpdateKeyList)', {
        toUpdateKeyList: toUpdateKeyList,
      })
      .orderBy('locale.create_time')
      .getMany()

    const toUpdateMap = transformListToObj(toUpdateList, localeDict)

    const recordList = []
    updateList.forEach((item, index) => {
      if (!toUpdateMap[item['zh-CN']]) {
        const record = {
          operate_way: 'batch',
          operate_type: 'add',
          operator_id: user.userId,
          operator_name: user.username,
          operator_ip_address: user.ip_address,
          operate_field: item['zh-CN'],
          previous_content: JSON.stringify({}),
          current_content: JSON.stringify(completeLocaleItem(item, localeDict)),
        }
        recordList.push(record)
        updateList[index] = Object.assign(new LocaleEntity(), item)
      } else {
        const updated = {
          ...toUpdateMap[item['zh-CN']],
          ...item,
        }

        const isEqualData = isEqual(updated, toUpdateMap[item['zh-CN']])
        if (!isEqualData) {
          const record = {
            operate_way: 'batch',
            operate_type: 'modify',
            operator_id: user.userId,
            operator_name: user.username,
            operator_ip_address: user.ip_address,
            operate_field: item['zh-CN'],
            previous_content: JSON.stringify(toUpdateMap[item['zh-CN']]),
            current_content: JSON.stringify(updated),
          }
          recordList.push(record)
        }
      }
    })
    await this.recordService.addRecordList(recordList)

    const updatedList = await this.localeRepository.save(updateList)

    return { list: updatedList }
  }
}
