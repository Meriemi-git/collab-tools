import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Floor, StratMap } from '@collab-tools/datamodel';
import {
  AddFloor,
  AddStratMap,
  DeleteFloor,
  DeleteStratMap,
  FetchStratMaps,
  getAllStratMaps,
  StratEditorState,
  UpdateFloor,
  UpdateStratMap,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-admin-strat-map-panel',
  templateUrl: './admin-strat-map-panel.component.html',
})
export class AdminStratMapPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $stratMaps: Observable<StratMap[]>;
  public selectedStratMap: StratMap;
  public selectedFloor: Floor;
  constructor(private readonly store: Store<StratEditorState>) {
    super();
  }

  ngOnInit(): void {
    this.$stratMaps = this.store.select(getAllStratMaps);
    this.$stratMaps.pipe(takeUntil(this.unsubscriber)).subscribe((straMaps) => {
      if (this.selectedStratMap) {
        this.selectedStratMap = straMaps?.find(
          (straMap) => straMap._id === this.selectedStratMap._id
        );
      }
    });
    this.store.dispatch(FetchStratMaps());
  }

  onStratMapAdded(data: FormData) {
    this.store.dispatch(AddStratMap({ data }));
  }

  onStratMapUpdated(data: FormData) {
    this.store.dispatch(UpdateStratMap({ data }));
  }

  onStratMapDeleted(stratMapId: string) {
    this.store.dispatch(DeleteStratMap({ stratMapId }));
    this.selectedStratMap = null;
  }

  onStratMapSelected(stratMap: StratMap) {
    this.selectedFloor = null;
    this.selectedStratMap = stratMap;
  }

  onFloorAdded(data: FormData) {
    this.store.dispatch(AddFloor({ mapId: this.selectedStratMap._id, data }));
  }

  onFloorSelected(floor: Floor) {
    this.selectedFloor = floor;
  }

  onFloorUpdated(data: FormData) {
    this.store.dispatch(
      UpdateFloor({ mapId: this.selectedStratMap._id, data })
    );
  }

  onFloorDeleted(floorId: string) {
    this.store.dispatch(
      DeleteFloor({ mapId: this.selectedStratMap._id, floorId })
    );
  }
}
