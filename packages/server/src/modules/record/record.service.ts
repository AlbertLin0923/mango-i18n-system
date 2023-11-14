import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { RecordEntity } from './record.entity.js'

import { createQueryParams } from '../../common/utils/index.js'

import type { Repository } from 'typeorm'
import type { AddRecordDTO, QueryRecordDTO } from './record.dto.js'
import type {
  RecordVO,
  RecordListVO,
  RecordSearchOptionsVO,
} from './record.vo.js'
import type { UserService } from '../user/user.service.js'

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    private readonly userService: UserService,
  ) {}

  async getSearchOptions(): Promise<RecordSearchOptionsVO> {
    const operateWayMap = [
      {
        label: 'single',
        value: 'single',
      },
      {
        label: 'batch',
        value: 'batch',
      },
    ]

    const operateTypeMap = [
      {
        label: 'add',
        value: 'add',
      },
      {
        label: 'modify',
        value: 'modify',
      },
      {
        label: 'delete',
        value: 'delete',
      },
    ]

    const { list } = await this.userService.getUserList({
      pageSize: 100000,
      page: 1,
    })

    const operatorNameMap = list.map((i) => {
      return { label: i.username, value: i.username }
    })

    return { operateWayMap, operateTypeMap, operatorNameMap }
  }

  async getRecordList({
    pageSize = 10,
    page = 1,
    operate_way,
    operate_type,
    create_time,
    operator_id,
    operator_name,
    operate_field,
  }: QueryRecordDTO): Promise<RecordListVO> {
    const sql = createQueryParams(
      {
        operate_way,
        operate_type,
        create_time,
        operator_id,
        operator_name,
        operate_field,
      },
      'record',
      'create_time',
    )

    console.log('sql', sql)

    const data: [RecordEntity[], number] = await this.recordRepository
      .createQueryBuilder('record')
      .where(sql[0], sql[1])
      .orderBy('record.create_time', 'DESC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount()

    return { list: data[0], total: data[1] }
  }

  async addRecord(data: AddRecordDTO): Promise<RecordVO> {
    const item = await this.recordRepository.save(
      Object.assign(new RecordEntity(), data),
    )
    return { item }
  }

  async addRecordList(data: AddRecordDTO[]): Promise<RecordListVO> {
    const list = await this.recordRepository.save(
      data.map((i) => {
        return Object.assign(new RecordEntity(), i)
      }),
      {
        chunk: data.length / 10,
      },
    )
    return { list, total: list.length }
  }
}
