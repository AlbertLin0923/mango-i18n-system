import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'; 

import { UserService } from './user.service.js'
import { UserController } from './user.controller.js'
import { UserEntity } from './user.entity.js'

import { JwtStrategy } from '../../common/strategies/jwt.strategy.js'
import { LocalStrategy } from '../../common/strategies/local.strategy.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // 引入 ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  providers: [UserService, LocalStrategy, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
