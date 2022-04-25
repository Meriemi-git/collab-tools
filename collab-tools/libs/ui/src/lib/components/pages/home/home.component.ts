import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StratEditorState } from '@collab-tools/store';

@Component({
  selector: 'collab-tools-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    private readonly router: Router,
    private readonly store: Store<StratEditorState>
  ) {}

  onClickEditor() {
    this.router.navigateByUrl('/editor');
  }

  onClickSharedLibrary() {
    this.router.navigateByUrl('/shared-strats');
  }
}
