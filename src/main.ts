import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';
import { NextFunction, Request, Response } from 'express';
import { logger } from './helpers/logger';
import cookieParser from 'cookie-parser';

dotenv.config();
morgan.token('response-time-ms', (req, res) => {
  return `${Date.now() - req["startTime"]} ms`;
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        String(process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
      ],
      credentials: true
    },
    bodyParser: true,
    rawBody: true,
    forceCloseConnections: true
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    // whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.use((req: Request, res: Response, next: NextFunction) => {
    req["startTime"] = Date.now();
    next();
  });
  app.use(morgan(
    ':method :url - :status - :remote-addr - :user-agent - :response-time-ms',
    {
      stream: {
        write: (message) => {
          logger.info(message.trim());
        }
      }
    }
  ))
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
