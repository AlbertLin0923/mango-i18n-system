import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecordEntity } from './record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity]), UserModule],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
