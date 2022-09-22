import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './modules/user/user.module';
import { LocaleModule } from './modules/locale/locale.module';
import { SettingModule } from './modules/setting/setting.module';
import { RecordModule } from './modules/record/record.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(__dirname, '../database/translate.db'),
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../public'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    LocaleModule,
    SettingModule,
    RecordModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
