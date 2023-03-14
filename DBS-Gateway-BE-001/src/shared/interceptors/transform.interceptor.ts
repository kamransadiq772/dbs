import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../../dto/common/ApiResponse.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto> {
    return next.handle().pipe(
      map((data) => {
        if (data.error || data.errors || data.code?.includes('Exception')) {
          return {
            errors: !data.error ? data.errors : [data.code?.includes('Exception') ? data :data.error],
            message: data.message,
            data: null,
          };
        } else {
          return {
            data,
            message: null,
            errors: null,
          };
        }
      }),
    );
  }
}
