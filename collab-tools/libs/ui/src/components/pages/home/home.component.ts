import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CollabToolsState } from '@collab-tools/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'collab-tools-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    private readonly router: Router,
    private readonly store: Store<CollabToolsState>
  ) {}

  onClickEditor() {
    this.router.navigateByUrl('/editor');
  }

  onClickSharedLibrary() {
    this.router.navigateByUrl('/shared-draws');
  }
}
