import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Log full stack trace
    this.logger.error('=== EXCEPTION DETAILS ===');
    this.logger.error(`URL: ${request.method} ${request.originalUrl}`);
    this.logger.error(`Exception:`, exception);
    if (exception instanceof Error) {
      this.logger.error(`Message: ${exception.message}`);
      this.logger.error(`Stack:`, exception.stack);
    }
    this.logger.error('=== END EXCEPTION ===');

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
