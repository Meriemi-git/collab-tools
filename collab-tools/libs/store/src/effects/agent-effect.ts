import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AgentService } from '@collab-tools/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actions from '../actions/agent.action';
import { DisplayMessage } from '../actions/notification.action';
import { NotificationState } from '../states/notifications.state';
@Injectable()
export class AgentEffect {
  private readonly AGENT_SERVICE_SUMMARY = _('agent-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly agentService: AgentService,
    private readonly store: Store<NotificationState>
  ) {}

  getAllAgents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchAgents),
      mergeMap(() =>
        this.agentService.getAllAgents().pipe(
          map((agents) => actions.FetchAgentsSuccess({ agents })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('agent-service.error.get-all'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.AgentError({ error }));
          })
        )
      )
    )
  );

  addAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.AddAgent),
      mergeMap((action) =>
        this.agentService.addAgent(action.data).pipe(
          map((agent) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('agent-service.success.add'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return actions.AddAgentSuccess({ agent });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('agent-service.error.add'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.AgentError({ error }));
          })
        )
      )
    )
  );

  updateAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UpdateAgent),
      mergeMap((action) =>
        this.agentService.updateAgent(action.data).pipe(
          map((agent) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('agent-service.success.update'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return actions.UpdateAgentSuccess({ agent });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('agent-service.error.update'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.AgentError({ error }));
          })
        )
      )
    )
  );

  deleteAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteAgent),
      mergeMap((action) =>
        this.agentService.deleteAgent(action.agentId).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('agent-service.success.delete'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteAgentSuccess({ agentId: action.agentId });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('agent-service.error.delete'),
                  titleKey: this.AGENT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.AgentError({ error }));
          })
        )
      )
    )
  );
}
