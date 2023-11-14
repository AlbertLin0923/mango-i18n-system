import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'

import { RecordEntity } from '../record/record.entity.js'

import type { Repository } from 'typeorm'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
  ) {}

  @Cron('0 0 0 * * 5')
  async cleanRecordData() {
    const data: [RecordEntity[], number] = await this.recordRepository
      .createQueryBuilder('record')
      .orderBy('record.create_time', 'ASC')
      .getManyAndCount()

    const [list, total] = [data[0], data[1]]

    if (total > 5000) {
      const deleteNum = total - 5000
      const ids = list.slice(0, deleteNum).map((i) => i.id)
      await this.recordRepository
        .createQueryBuilder('record')
        .delete()
        .where('record.id IN (:...ids)', { ids: ids })
        .execute()
    }
  }
}
