import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Layer } from '@collab-tools/datamodel';
import { StratService } from '@collab-tools/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { AddToUserLikes, RemoveToUserLikes } from '../actions';
import {
  ClearCanvasState,
  InitCanvas,
  LoadCanvas,
  SetFloorImage,
} from '../actions/canvas.action';
import { DisplayMessage } from '../actions/notification.action';
import {
  ClearStratMapState,
  SelectStratMap,
} from '../actions/strat-map.action';
import {
  ClearStratState,
  CreateStrat,
  DeleteStrat,
  DeleteStratSuccess,
  DislikeStrat,
  DislikeStratSuccess,
  GetStratsPaginated,
  GetStratsPaginatedSuccess,
  LikeStrat,
  LikeStratSuccess,
  LoadStrat,
  LoadStratSuccess,
  SaveStrat,
  SaveStratSuccess,
  SetActiveLayer,
  SetFirstLayerActive,
  SetTacticalMode,
  StratError,
  UpdateStrat,
  UpdateStratInfosAndSave,
  UpdateStratSuccess,
} from '../actions/strat.action';
import { StratEditorState } from '../reducers';
import { getStratMapById } from '../selectors/strat-map.selector';
import { getActiveLayer, getStrat } from '../selectors/strat.selector';

@Injectable()
export class StratEffect {
  private readonly STRAT_SERVICE_SUMMARY_KEY = _('strat-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly stratService: StratService,
    private readonly store: Store<StratEditorState>
  ) {}

  afterCreateStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateStrat),
      mergeMap(() => of(SetFirstLayerActive()))
    )
  );

  afterLoadStratSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadStratSuccess),
      mergeMap((action) =>
        this.store.select(getStratMapById(action.strat.mapId)).pipe(take(1))
      ),
      switchMap((stratMap) => [
        SelectStratMap({ stratMap }),
        SetFirstLayerActive(),
      ])
    )
  );

  afterSetFirstLayerActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SetFirstLayerActive),
      switchMap(() => this.store.select(getActiveLayer).pipe(take(1))),
      mergeMap((layer) => {
        return this.initOrLoadCanvas(layer);
      })
    )
  );

  afterSetActiveLayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SetActiveLayer),
      map((action) => action.layer),
      mergeMap((layer) => {
        return this.initOrLoadCanvas(layer);
      })
    )
  );

  afterUpdateStratInfos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateStratInfosAndSave),
      switchMap(() => this.store.select(getStrat).pipe(take(1))),
      mergeMap((strat) => {
        if (strat._id) {
          return of(UpdateStrat({ strat: strat }));
        } else {
          return of(SaveStrat({ strat: strat }));
        }
      })
    )
  );

  afterDeletingStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteStratSuccess),
      switchMap(() => [
        ClearStratState(),
        ClearCanvasState(),
        ClearStratMapState(),
      ])
    )
  );

  afterSetTacticalMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SetTacticalMode),
      map((action) => action.tacticalMode),
      switchMap((enabled) =>
        forkJoin({
          enabled: of(enabled),
          layer: this.store.select(getActiveLayer).pipe(take(1)),
        })
      ),
      mergeMap((result) => {
        const floorImage = result.layer.tacticalMode
          ? result.layer.floor.image_tactical
          : result.layer.floor.image_realistic;
        return of(SetFloorImage({ floorImage }));
      })
    )
  );

  getStratsPaginated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetStratsPaginated),
      mergeMap((action) =>
        this.stratService
          .getStratsPaginated(action.pageOptions, action.stratFilter)
          .pipe(
            map((pageResults) => GetStratsPaginatedSuccess({ pageResults })),
            catchError((error: HttpErrorResponse) => {
              this.store.dispatch(
                DisplayMessage({
                  message: {
                    level: 'error',
                    messageKey: _('strat-service.error.get-all'),
                    titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                  },
                })
              );
              return of(StratError({ error }));
            })
          )
      )
    )
  );

  loadStratById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadStrat),
      mergeMap((action) =>
        this.stratService.loadStratById(action.stratId).pipe(
          map((strat) => LoadStratSuccess({ strat })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-service.error.load'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(StratError({ error }));
          })
        )
      )
    )
  );

  saveStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaveStrat),
      mergeMap((action) =>
        this.stratService.saveStrat(action.strat).pipe(
          map((strat) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-service.success.save'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return SaveStratSuccess({ strat });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-service.error.save'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(StratError({ error }));
          })
        )
      )
    )
  );

  updateStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateStrat),
      mergeMap((action) =>
        this.stratService.updateStrat(action.strat).pipe(
          map((strat) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-service.success.update'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return UpdateStratSuccess({ strat });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-service.error.update'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(StratError({ error }));
          })
        )
      )
    )
  );

  deleteStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteStrat),
      mergeMap((action) =>
        this.stratService.deleteStrat(action.stratId).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-service.success.delete'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return DeleteStratSuccess({ stratId: action.stratId });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-service.error.delete'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(StratError({ error }));
          })
        )
      )
    )
  );

  likeStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LikeStrat),
      mergeMap((action) =>
        this.stratService.likeStrat(action.strat._id).pipe(
          map((like) => {
            this.store.dispatch(AddToUserLikes({ like }));
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-service.success.like'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return LikeStratSuccess({ strat: action.strat });
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            if (error.status === 467) {
              messageKey = _('strat-service.error.like_own');
            } else if (error.status === 468) {
              messageKey = _('strat-service.error.like_twice');
            } else {
              messageKey = _('strat-service.error.like_unknown');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(StratError({ error }));
          })
        )
      )
    )
  );

  dislikeStrat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DislikeStrat),
      mergeMap((action) =>
        this.stratService.dislikeStrat(action.strat._id).pipe(
          map(() => {
            this.store.dispatch(
              RemoveToUserLikes({ stratId: action.strat._id })
            );
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-service.success.dislike'),
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return DislikeStratSuccess({ strat: action.strat });
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;

            if (error.status === 467) {
              messageKey = _('strat-service.error.dislike_own');
            } else if (error.status === 468) {
              messageKey = _('strat-service.error.dislike_this');
            } else {
              messageKey = _('strat-service.error.dislike_unknown');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.STRAT_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(StratError({ error }));
          })
        )
      )
    )
  );

  private initOrLoadCanvas(layer: Layer) {
    if (layer.canvas) {
      return of(LoadCanvas({ canvas: layer.canvas }));
    } else {
      const floorImage = layer.tacticalMode
        ? layer.floor.image_tactical
        : layer.floor.image_realistic;
      return of(InitCanvas({ floorImage: floorImage }));
    }
  }
}
