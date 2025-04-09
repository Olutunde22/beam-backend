/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

interface IError {
  message: string;
  statusCode: number;
}
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();

    const error: IError = this.getGenericError(exception);

    const code = this.getStatusCode(exception);

    this.logMessage(req, error, code, exception);

    response.status(code).json({
      statusCode: code,
      message: code !== 500 ? error.message : 'Something went wrong',
      success: false,
    });
  }

  private getGenericError(exception: unknown): IError {
    return exception instanceof HttpException
      ? (exception.getResponse() as IError)
      : { message: (exception as Error).message, statusCode: 500 };
  }

  private getStatusCode(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
    exception: any,
  ): void {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} statusCode=${
          message.statusCode ? message.statusCode : null
        } message=${message.message ? message.message : null}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} statusCode=${
          message.statusCode ? message.statusCode : null
        } message=${message.message ? message.message : null}`,
      );
    }
  }
}
