import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({ template: '' })
export abstract class AbsctractObserverComponent implements OnDestroy {
  protected readonly unsubscriber = new Subject();

  ngOnDestroy(): void {
    this.unsubscriber.next(null);
    this.unsubscriber.complete();
  }
}
