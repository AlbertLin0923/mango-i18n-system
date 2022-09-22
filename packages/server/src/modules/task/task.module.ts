import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecordEntity } from '../record/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity])],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
