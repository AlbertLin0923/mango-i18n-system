import { createParamDecorator } from '@nestjs/common'
import * as requestIp from 'request-ip'

import type { ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const ip_address = requestIp.getClientIp(request)
    return { ...request.user, ip_address }
  },
)
