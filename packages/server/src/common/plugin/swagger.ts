import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

// 配置 Swagger UI
export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('自动国际化文案配置系统API')
    .setDescription('接口列表')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/docs', app, document)
}
