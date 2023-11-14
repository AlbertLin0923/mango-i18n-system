import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RecordEntity } from './record.entity.js'
import { RecordController } from './record.controller.js'
import { RecordService } from './record.service.js'

import { UserModule } from '../user/user.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity]), UserModule],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
