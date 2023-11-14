import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TaskService } from './task.service.js'

import { RecordEntity } from '../record/record.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity])],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
