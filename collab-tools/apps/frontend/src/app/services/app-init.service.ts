import { Injectable } from '@angular/core';
import { DrawerService } from '@collab-tools/services';
import {
  DrawEditorState,
  FeedDrawerActions,
  FeedDrawerOptions,
  RefreshTokens,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  constructor(
    private readonly store: Store<DrawEditorState>,
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
