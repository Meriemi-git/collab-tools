import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StratMap } from '@collab-tools/datamodel';
import {
  FetchStratMaps,
  getAllStratMaps,
  SelectStratMap,
  StratMapState,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss'],
})
export class MapSelectorComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $maps: Observable<StratMap[]>;

  constructor(
    private readonly store: Store<StratMapState>,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.$maps = this.store
      .select(getAllStratMaps)
      .pipe(takeUntil(this.unsubscriber));
    this.store.dispatch(FetchStratMaps());
  }

  public onStratMapSelected(map: StratMap) {
    this.store.dispatch(SelectStratMap({ stratMap: map }));
    this.router.navigateByUrl('editor');
  }
}
