import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as canvasActions from '../actions/canvas.action';
import * as stratActions from '../actions/draw.action';

@Injectable()
export class CanvasEffect {
  constructor(private readonly actions$: Actions) {}

  onCanvasUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(canvasActions.UpdateCanvas),
      mergeMap((action) =>
        of(stratActions.UpdateLayerCanvas({ canvas: action.canvas }))
      )
    )
  );
}
