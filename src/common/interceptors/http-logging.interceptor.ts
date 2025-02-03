// src/common/interceptors/http-logging.interceptor.ts
import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
  Inject,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';
import type { Request, Response } from 'express';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startTime;
        const { statusCode } = response;
        const controllerName = context.getClass().name;

        this.logger.info({
          level: 'info',
          message: `${method} ${originalUrl} - Request processed`,
          context: controllerName,
          method,
          path: originalUrl,
          durationMs,
          statusCode,
          userAgent,
          clientIp: ip,
        });
      }),
      catchError((err) => {
        const durationMs = Date.now() - startTime;
        this.logger.error({
          level: 'error',
          message: `${method} ${originalUrl} - Request failed`,
          context: context.getClass().name,
          method,
          path: originalUrl,
          durationMs,
          statusCode: err.status || 500,
          userAgent,
          clientIp: ip,
          error: {
            name: err.name,
            message: err.message,
            stack:
              process.env.NODE_ENV !== 'production' ? err.stack : undefined,
          },
        });
        throw err;
      }),
    );
  }
}
