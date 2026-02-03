import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Flutter mobile app
  app.enableCors({
    origin: [
      'https://mosana.xyz',
      'http://localhost:3000',
      'capacitor://localhost',
      'ionic://localhost',
      'http://localhost',
      'http://localhost:8080',
      'http://localhost:8100',
    ],
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Mosana API is running on: http://localhost:${port}/api`);
}
bootstrap();
