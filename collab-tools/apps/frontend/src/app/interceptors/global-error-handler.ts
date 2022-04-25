import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { StratMapLoadingError } from '@collab-tools/datamodel';
import { SelectStratMap } from '@collab-tools/store';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const store = this.injector.get(Store);
    if (error instanceof StratMapLoadingError) {
      store.dispatch(SelectStratMap({ stratMap: null }));
    } else {
      console.error(error);
    }
  }
}
