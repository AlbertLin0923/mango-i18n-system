import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SettingController } from './setting.controller.js'
import { SettingEntity } from './setting.entity.js'
import { SettingService } from './setting.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [SettingService],
})
export class SettingModule {}
