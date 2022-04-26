import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class CanvasEffect {
  constructor(private readonly actions$: Actions) {}

  // onCanvasUpdate$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(canvasActions.UpdateCanvas),
  //     mergeMap((action) =>
  //       of(drawActions.UpdateDrawCanvas({ canvas: action.canvas }))
  //     )
  //   )
  // );
}
