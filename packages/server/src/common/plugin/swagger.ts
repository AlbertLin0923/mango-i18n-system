import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// 配置 Swagger UI
export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('国际化文案配置系统API')
    .setDescription('国际化文案配置系统接口列表')
    .setVersion('0.9')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
}
