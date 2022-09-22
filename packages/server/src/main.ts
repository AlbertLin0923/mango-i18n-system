import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import cookieParser from 'cookie-parser';
// import helmet from 'helmet';
// import csurf from 'csurf';

import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
// import { logger } from './common/middleware/logger.middleware';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { ValidationPipe } from './common/pipe/validation.pipe';

import { setupSwagger } from './common/plugin/swagger';

import CONFIG from './common/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*' },
  });

  // 全局中间件

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionFilter());

  // 全局管道
  app.useGlobalPipes(new ValidationPipe());

  // 配置全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 配置静态资源
  app.useStaticAssets(join(__dirname, '../public', '/'), {
    prefix: '/',
    setHeaders: (res) => {
      res.set('Cache-Control', 'max-age=2592000');
    },
  });

  app.use(cookieParser());
  // app.use(helmet());
  // app.use(csurf({ cookie: true }));

  app.setGlobalPrefix('api');

  // swagger配置
  setupSwagger(app);

  await app.listen(CONFIG.get('serverPort'));

  console.log(
    `Server started on port http:localhost:${CONFIG.get('serverPort')}`,
  );
  console.log(
    `Docs started on port http:localhost:${CONFIG.get('serverPort')}/docs/`,
  );
}

bootstrap();
