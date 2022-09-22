import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleController } from './locale.controller';
import { LocaleService } from './locale.service';
import { LocaleEntity } from './locale.entity';

import { SettingModule } from '../setting/setting.module';
import { RecordModule } from '../record/record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocaleEntity]),
    SettingModule,
    RecordModule,
  ],
  providers: [LocaleService],
  controllers: [LocaleController],
})
export class LocaleModule {}
