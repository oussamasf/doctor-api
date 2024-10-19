import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { globalErrorMessages } from '../../src/common/constants/errorMessages';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status: number = HttpStatus.TOO_MANY_REQUESTS;
    const message: string = globalErrorMessages.TOO_MANY_REQUESTS;

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
