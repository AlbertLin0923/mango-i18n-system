import { Injectable } from '@nestjs/common'
import { tap } from 'rxjs/operators'

import { Logger } from '../plugin/log4js.js'
import { parseDateString } from '../utils/index.js'

import { Request } from 'express'
import { Observable } from 'rxjs'
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    // const response = ctx.getResponse<Response>();

    const startTime = new Date().getTime()

    return next.handle().pipe(
      tap((data) => {
        // console.log(data);
        const endTime = new Date().getTime()
        const logFormat = `
============================================================Start================================================================
Start Time      : ${parseDateString(startTime)}
URL             : ${request.url}
Method          : ${request.method}
IP              : ${request.ip}
User            : ${request.headers.authorization}

Request Query   : ${JSON.stringify(request.query)}
Request Params  : ${JSON.stringify(request.params)}
Request Body    : ${JSON.stringify(request.body)}
Response Code   : ${data.code}
Time Consuming  : ${endTime - startTime}ms
End Time        : ${parseDateString(endTime)}
=============================================================End==================================================================
`

        Logger.log(logFormat)
        return data
      }),
    )
  }
}
