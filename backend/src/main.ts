import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'https://carbonbloom.cognitron.co.ke'
    ],
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('gap/api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Gap Analysis System API')
    .setDescription(
      'Comprehensive compliance & risk management platform for Kenyan banking sector',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('gap/api/docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/gap/api`);
  console.log(
    `📚 Swagger documentation: http://localhost:${port}/gap/api/docs`,
  );
}
bootstrap();
