import { Component, OnInit } from '@angular/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { AttributeFilter, PageOptions, UserDto } from '@collab-tools/datamodel';
import {
  CollabToolsState,
  DeleteUser,
  getAllUsers,
  getUserPageMetadata,
  GetUsersPaginated,
  UpdateUser,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(private readonly store: Store<CollabToolsState>) {
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
