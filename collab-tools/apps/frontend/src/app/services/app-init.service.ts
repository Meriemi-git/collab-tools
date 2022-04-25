import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DrawerService } from '@collab-tools/services';
import { StratEditorState, RefreshTokens, FeedDrawerActions, FeedDrawerOptions } from '@collab-tools/store';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  constructor(
    private readonly store: Store<StratEditorState>,
    private readonly drawingService: DrawerService
  ) {}

  public initializeApp(): void {
    this.store.dispatch(RefreshTokens());
    this.store.dispatch(
      FeedDrawerActions({
        drawingActions: this.drawingService.actions,
      })
    );
    this.store.dispatch(
      FeedDrawerOptions({
        drawerOptions: this.drawingService.options,
      })
    );
  }
}
