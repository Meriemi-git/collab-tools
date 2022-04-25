import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Gadget } from '@collab-tools/datamodel';
import {
  AddGadget,
  DeleteGadget,
  FetchGadgets,
  getAllGadgets,
  StratEditorState,
  UpdateGadget,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-admin-gadget-panel',
  templateUrl: './admin-gadget-panel.component.html',
  styleUrls: ['./admin-gadget-panel.component.scss'],
})
export class AdminGadgetPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $gadgets: Observable<Gadget[]>;

  private draggedGadget: Gadget;

  public gadget: Gadget;
  constructor(private readonly store: Store<StratEditorState>) {
    super();
  }

  ngOnInit(): void {
    this.$gadgets = this.store
      .select(getAllGadgets)
      .pipe(takeUntil(this.unsubscriber));
    this.store.dispatch(FetchGadgets());
  }

  onGadgetAdded(data: FormData) {
    this.store.dispatch(AddGadget({ data }));
  }

  onGadgetUpdated(data: FormData) {
    this.store.dispatch(UpdateGadget({ data }));
  }

  onGadgetDeleted(gadgetId: string) {
    this.store.dispatch(DeleteGadget({ gadgetId }));
    this.gadget = null;
  }

  onGadgetDragged(gadget: Gadget) {
    this.gadget = null;
    this.draggedGadget = gadget;
  }

  @HostListener('drop', ['$event'])
  onwindowDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.gadget = this.draggedGadget;
  }
}
