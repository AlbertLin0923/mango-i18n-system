import { Catch, HttpException, HttpStatus } from '@nestjs/common'

import { Logger } from '../plugin/log4js.js'
import { BusinessException } from '../exception/business.exception.js'
import { parseDateString } from '../utils/index.js'

import { Request, Response } from 'express'
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any & HttpException, host: ArgumentsHost) {
    // 把请求相关的参数转成标准http的上下文
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 判断状态是否为请求异常,否则直接抛回来服务内部错误
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // 此刻的时间
    const nowDate = parseDateString(Date.now())

    const originResponse = {
      code: status,
      msg: exception?.message || exception?.message?.message || '请求失败',
      meta: exception?.response?.meta || '',
      error: exception?.name,
    }

    if (exception instanceof BusinessException) {
      originResponse.msg = exception.getErrorMsg()
      originResponse.code = exception.getCode()
    }

    // 包装异常信息
    const errorResponse = {
      ...originResponse,
      success: false,
      date: nowDate,
      path: request.url,
    }

    // 记录异常信息到第三方logger

    const logFormat = ` 
    ============================Start===========================
    Date           : ${nowDate}
    URL            : ${request.url}
    Method         : ${request.method}
    IP             : ${request.ip}
    User           : ${request.headers.authorization}
    Request Query  : ${JSON.stringify(request.query)}
    Request Params : ${JSON.stringify(request.params)}
    Request Body   : ${JSON.stringify(request.body)}
    Error Code     : ${status}
    Exception      : ${exception}
    ============================End=============================
    `

    Logger.error(logFormat)

    // 设置返回的状态码等
    response
      .status(status)
      .header('Content-Type', 'application/json; charset=utf-8')
      .json(errorResponse)
  }
}
