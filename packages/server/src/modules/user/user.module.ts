import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';

import { UserController } from './user.controller';

import { UserEntity } from './user.entity';

import { LocalStrategy } from '../../common/strategies/local.strategy';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

import CONFIG from '../../common/config';
const jwtSecurity = CONFIG.get('jwtSecurity');

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: jwtSecurity.jwtAccessSecret,
      signOptions: { expiresIn: jwtSecurity.expiresIn },
    }),
    PassportModule,
  ],
  providers: [UserService, LocalStrategy, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
