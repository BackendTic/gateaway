import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import * as cors from 'cors';

async function bootstrap() {
  const logger = new Logger("Main-gateway")

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  app.use(cors({
    origin: 'http://localhost:3000',  // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Si estás usando cookies o autenticación
  }));
  
  await app.listen(envs.port);
  logger.log(`Gateway running on port ${envs.port}`)
}
bootstrap();
