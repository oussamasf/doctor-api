import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordFieldInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object' && data !== null) {
          data.password = undefined;
          data.refreshToken = undefined;
          if (data?.results?.length > 0) {
            data.results.forEach((result: any) => {
              result.password = undefined;
              result.refreshToken = undefined;
            });
          }
        }
        return data;
      }),
    );
  }
}
