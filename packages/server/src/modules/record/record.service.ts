import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RecordEntity } from './record.entity.js'
import { AddRecordDTO, QueryRecordDTO } from './record.dto.js'
import { RecordVO, RecordListVO, RecordSearchOptionsVO } from './record.vo.js'
import { operateWayMap, operateTypeMap } from './record.dict.js'

import { createQueryParams } from '../../common/utils/index.js'
import { UserService } from '../user/user.service.js'
@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    private readonly userService: UserService,
  ) {}

  async getSearchOptions(): Promise<RecordSearchOptionsVO> {
    const { list } = await this.userService.getUserList({
      pageSize: 100000,
      page: 1,
    })

    return {
      operateWayMap,
      operateTypeMap,
      operatorNameMap: list.map((i) => {
        return { label: i.username, value: i.username }
      }),
    }
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
