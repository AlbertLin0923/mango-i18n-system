import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LocaleController } from './locale.controller.js'
import { LocaleService } from './locale.service.js'
import { LocaleEntity } from './locale.entity.js'

import { SettingModule } from '../setting/setting.module.js'
import { RecordModule } from '../record/record.module.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([LocaleEntity]),
    SettingModule,
    RecordModule,
  ],
  providers: [LocaleService],
  controllers: [LocaleController],
  exports: [LocaleService],
})
export class LocaleModule {}
