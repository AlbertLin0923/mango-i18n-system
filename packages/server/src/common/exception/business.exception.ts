// 处理业务异常
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  private readonly errMsg: string;
  private readonly code?: number;
  constructor(errMsg: string, code?: number) {
    super({ msg: errMsg, success: false }, HttpStatus.OK);
    this.errMsg = errMsg;
    this.code = code || 500;
  }
  getErrorMsg(): string {
    return this.errMsg;
  }
  getCode(): number {
    return this.code;
  }
}
