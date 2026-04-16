import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>().statusCode;

    return next.handle().pipe(
      map((data: unknown): ApiResponse<T> => {
        const d = data as Record<string, unknown> | null | undefined;
        const message =
          typeof d?.['message'] === 'string' ? d['message'] : 'Success';
        const payload =
          typeof d?.['message'] === 'string'
            ? (Object.fromEntries(
                Object.entries(d).filter(([key]) => key !== 'message'),
              ) as T)
            : (data as T);

        return { statusCode, message, data: payload };
      }),
    );
  }
}
