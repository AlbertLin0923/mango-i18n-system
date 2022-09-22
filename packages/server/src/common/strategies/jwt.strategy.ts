import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 对于您选择的任何 Passport 策略，都需要 @nestjs/Passport 和 Passport 包。然后，需要安装特定策略的包(例如，passport-jwt 或 passport-local)，它实现您正在构建的特定身份验证策略。
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { BusinessException } from '../exception/business.exception';

import { UserEntity } from '../../modules/user/user.entity';

import CONFIG from '../config';
const jwtSecurity = CONFIG.get('jwtSecurity');

//通过在子类中实现 validate() 方法，可以提供verify 回调
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecurity.jwtAccessSecret,
    });
  }

  async validate(payload: {
    userId: string;
    /**
     * Issued at
     */
    iat: number;
    /**
     * Expiration time
     */
    exp: number;
  }): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      userId: payload.userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.account_status === 'freeze') {
      throw new BusinessException('账户已被冻结，请联系管理员', 403);
    }

    return user;
  }
}
