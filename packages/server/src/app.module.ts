import * as path from 'path'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config'

import { AppService } from './app.service.js'
import { AppController } from './app.controller.js'
import { UserModule } from './modules/user/user.module.js'
import { LocaleModule } from './modules/locale/locale.module.js'
import { SettingModule } from './modules/setting/setting.module.js'
import { RecordModule } from './modules/record/record.module.js'
import { TaskModule } from './modules/task/task.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(process.cwd(), './database/translate.db'),
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), './public'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    LocaleModule,
    SettingModule,
    TaskModule,
    RecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
