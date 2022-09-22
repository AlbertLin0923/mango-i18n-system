import { Injectable } from '@nestjs/common';

// 对于您选择的任何 Passport 策略，都需要 @nestjs/Passport 和 Passport 包。然后，需要安装特定策略的包(例如，passport-jwt 或 passport-local)，它实现您正在构建的特定身份验证策略。
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

// 通过在子类中实现 validate() 方法，可以提供verify 回调
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    if (!username || !password) {
      return false;
    }
    return { username, password };
  }
}
