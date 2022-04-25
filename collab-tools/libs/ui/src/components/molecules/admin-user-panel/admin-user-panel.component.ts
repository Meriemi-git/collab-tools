import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeFilter, PageOptions, UserDto } from '@collab-tools/datamodel';
import {
  DeleteUser,
  getAllUsers,
  getUserPageMetadata,
  GetUsersPaginated,
  StratEditorState,
  UpdateUser,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-admin-user-panel',
  templateUrl: './admin-user-panel.component.html',
})
export class AdminUserPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $users: Observable<UserDto[]>;
  public length: number;
  public rows = 2;

  constructor(private readonly store: Store<StratEditorState>) {
    super();
  }

  ngOnInit(): void {
    this.$users = this.store.select(getAllUsers);
    this.store
      .select(getUserPageMetadata)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((pageMetadata) => {
        if (pageMetadata) {
          this.length = pageMetadata.totalDocs;
        }
      });
  }

  onUserUpdated(updated: UserDto) {
    this.store.dispatch(UpdateUser({ updated }));
  }

  onUserDeleted(deleted: UserDto) {
    this.store.dispatch(DeleteUser({ deleted }));
  }

  onUserFiltered(filterEvent: {
    userFilter: AttributeFilter;
    pageOptions: PageOptions;
  }) {
    this.rows = filterEvent.pageOptions.limit;
    this.store.dispatch(
      GetUsersPaginated({
        pageOptions: filterEvent.pageOptions,
        userFilters: filterEvent.userFilter,
      })
    );
  }
}
