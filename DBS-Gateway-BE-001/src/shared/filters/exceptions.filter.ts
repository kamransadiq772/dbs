import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions Filter');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    this.logger.error(exception," exception");
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception?.statusCode
        ? exception.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      message: exception?.message || null,
      stack: exception?.stack || null ,
      errors: [
        {
          timestamp: new Date().toISOString(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
        },
      ],
      data: null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
