import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(process.env.PREFIX);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.VERSION,
  });

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('FoodKing')
    .setDescription('The FoodKing API description')
    .setVersion('1.0')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-AUTH',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const PORT = process.env.PORT ?? 3000
  await app.listen(PORT,()=>{
    console.log(`Server Litening on ${PORT}\n OPENAPI is \\api`)
  });
}
bootstrap();
