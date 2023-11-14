import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { UserService } from './user.service.js'
import { UserController } from './user.controller.js'
import { UserEntity } from './user.entity.js'

import { JwtStrategy } from '../../common/strategies/jwt.strategy.js'
import { LocalStrategy } from '../../common/strategies/local.strategy.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    PassportModule,
  ],
  providers: [UserService, LocalStrategy, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
