import { join } from 'node:path'

import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module.js'
import { ResponseInterceptor } from './common/interceptor/response.interceptor.js'
import { LoggingInterceptor } from './common/interceptor/logging.interceptor.js'
import { AllExceptionFilter } from './common/filter/all-exception.filter.js'
import { ValidationPipe } from './common/pipe/validation.pipe.js'
import { setupSwagger } from './common/plugin/swagger.js'

import type { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*' },
  })

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionFilter())

  // 全局管道
  app.useGlobalPipes(new ValidationPipe())

  // 配置全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new ResponseInterceptor())

  // 配置静态资源
  app.useStaticAssets(join(process.cwd(), './public'), {
    prefix: '/',
    setHeaders: (res) => {
      res.set('Cache-Control', 'max-age=2592000')
    },
  })

  app.use(cookieParser())
  // app.use(csurf({ cookie: true }));

  app.setGlobalPrefix('api')

  // swagger配置
  setupSwagger(app)

  await app.listen(process.env.SERVER_PORT)

  console.log(
    `Server started on port http:localhost:${process.env.SERVER_PORT}`,
  )
  console.log(
    `Docs started on port http:localhost:${process.env.SERVER_PORT}/docs/`,
  )
}

bootstrap()
