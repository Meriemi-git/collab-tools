import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Layer, Strat } from '@collab-tools/datamodel';
import { FloorService, StratMapService } from '@collab-tools/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { DisplayMessage } from '../actions/notification.action';
import * as actions from '../actions/strat-map.action';
import { CreateStrat } from '../actions/strat.action';
import { StratEditorState } from '../reducers';
import { getStrat, getUserInfos } from '../selectors';

@Injectable()
export class StratMapEffect {
  private readonly STRAT_MAP_SERVICE_SUMMARY = _('strat-map-service.summary');
  private readonly FLOOR_SERVICE_SUMMARY = _('floor-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly stratMapService: StratMapService,
    private readonly floorService: FloorService,
    private readonly store: Store<StratEditorState>
  ) {}


  afterStratMapSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.SelectStratMap),
      switchMap((action) =>
        forkJoin({
          strat: this.store.select(getStrat).pipe(take(1)),
          stratMap: of(action.stratMap),
          userInfos: this.store.select(getUserInfos).pipe(take(1)),
        })
      ),
      mergeMap((result) => {
        if (result.strat == null) {
          const newStrat: Strat = {
            createdAt: new Date(),
            name: `${
              result.stratMap.name
            } - ${new Date().toLocaleDateString()}`,
            description: 'Describe your strat here...',
            lastModifiedAt: new Date(),
            userId: result.userInfos?._id,
            votes: 0,
            layers: result.stratMap.floors
              .filter((f) => f.isValid)
              .map(
                (floor) =>
                  ({
                    floor: floor,
                    canvas: null,
                    tacticalMode: false,
                  } as Layer)
              ),
            attachedImages: [],
            stratMapImage: result.stratMap.image,
            mapId: result.stratMap._id,
            mapName: result.stratMap.name,
            isPublic: false,
            deprecated: false,
          };
          return of(CreateStrat({ strat: newStrat }));
        }
        return of({ type: 'NO-ACTION' });
      })
    )
  );

  getAllStratMaps$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchStratMaps.type),
      mergeMap(() =>
        this.stratMapService.getAllStratMaps().pipe(
          map((stratMaps) => actions.FetchStratMapsSuccess({ stratMaps })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-maps-service.error.get-all'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );

  addStratMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.AddStratMap),
      mergeMap((action) =>
        this.stratMapService.addStratMap(action.data).pipe(
          map((stratMap) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-maps-service.success.add'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return actions.AddStratMapSuccess({ stratMap });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-maps-service.error.add'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );

  updateStratMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UpdateStratMap),
      mergeMap((action) =>
        this.stratMapService.updateStratMap(action.data).pipe(
          map((stratMap) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-maps-service.success.update'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return actions.UpdateStratMapSuccess({ stratMap });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-maps-service.error.update'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );

  deleteStratMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteStratMap),
      mergeMap((action) =>
        this.stratMapService.deleteStratMap(action.stratMapId).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('strat-maps-service.success.delete'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteStratMapSuccess({
              stratMapId: action.stratMapId,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('strat-maps-service.error.delete'),
                  titleKey: this.STRAT_MAP_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );

  addFloor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.AddFloor),
      mergeMap((action) =>
        this.floorService.addFloor(action.mapId, action.data).pipe(
          map((stratMap) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('floor-service.success.add'),
                  titleKey: this.FLOOR_SERVICE_SUMMARY,
                },
              })
            );
            return actions.AddFloorSuccess({ stratMap });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('floor-service.error.add'),
                  titleKey: this.FLOOR_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );

  updateFloor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UpdateFloor),
      mergeMap((action) =>
        this.floorService.updateFloor(action.mapId, action.data).pipe(
          map((stratMap) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('floor-service.success.update'),
                  titleKey: this.FLOOR_SERVICE_SUMMARY,
                },
              })
            );
            return actions.UpdateFloorSuccess({ stratMap });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('floor-service.error.update'),
                  titleKey: this.FLOOR_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );

  deleteFloor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteFloor),
      mergeMap((action) =>
        this.floorService.deleteFloor(action.mapId, action.floorId).pipe(
          map((stratMap) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('floor-service.success.delete'),
                  titleKey: this.FLOOR_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteFloorSuccess({ stratMap });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('floor-service.error.delete'),
                  titleKey: this.FLOOR_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.StratMapError({ error }));
          })
        )
      )
    )
  );
}
