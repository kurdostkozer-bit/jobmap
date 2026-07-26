import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // HTTP Request logging - BEFORE anything else
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN?.split(',') || '*';
  console.log('🔐 CORS configured for:', corsOrigin);
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global prefix
  app.setGlobalPrefix('api');

  // Support root path checks from platforms like Render
  app.get('/', (req, res) => res.status(200).json({ status: 'ok', message: 'JobMap Backend is running' }));
  app.head('/', (req, res) => res.sendStatus(200));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`✅ JobMap Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
}

bootstrap().catch(err => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
