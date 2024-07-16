import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

async function bootstrap() {
  const port = process.env.PORT || 83;
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Test Service')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('region')
    .addTag('district')
    .addTag('admin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  await app.listen(port, () => console.log(`Admin API is running in port ${port}`));
}
bootstrap();
