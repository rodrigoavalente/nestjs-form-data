import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FORM_DATA_REQUEST_METADATA_KEY } from '../decorators/form-data';
import { FormDataInterceptorConfig } from '../interfaces/FormDataInterceptorConfig';
import { FormReader } from '../classes/FormReader';
import { catchError, from, mergeMap, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GLOBAL_CONFIG_INJECT_TOKEN } from '../config/global-config-inject-token.config';
import { checkConfig } from '../helpers/check-config';
import { is } from 'type-is';


@Injectable()
export class FormDataInterceptor implements NestInterceptor {
  reflector: Reflector = new Reflector();

  constructor(@Inject(GLOBAL_CONFIG_INJECT_TOKEN)
              private globalConfig: FormDataInterceptorConfig) {

  }


  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    /** if the request is not multipart, skip **/
    if (!is(req, ['multipart'])) return next.handle();

    /** merge global config with method level config **/
    const config: FormDataInterceptorConfig = checkConfig(
      this.reflector.get(FORM_DATA_REQUEST_METADATA_KEY, context.getHandler()) || {},
      this.globalConfig,
    );

    const formReader: FormReader = new FormReader(req, config);

    return from(formReader.handle()).pipe(
      mergeMap((formReaderResult: any) => {
        req.body = formReaderResult;
        return next.handle();
      }),

      catchError(err => {
        if (config.autoDeleteFile)
          formReader.deleteFiles();
        return throwError(err);
      }),

      tap(res => {
        if (config.autoDeleteFile)
          formReader.deleteFiles();
      }),
    );

  }
}
