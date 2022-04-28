import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { UserDto } from '@collab-tools/datamodel';
import {
  CollabToolsState,
  getSuggestions,
  GetUserInfos,
  SearchUser,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-user-finder',
  templateUrl: './user-finder.component.html',
  styleUrls: ['./user-finder.component.scss'],
})
export class UserFinderComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  @Input()
  public exclusions: string[];

  @Output()
  public inviteAll = new EventEmitter<string[]>();

  public userInfos: UserDto;
  public text: string;
  public suggestions: string[] = [];
  public selectedUsernames: string[] = [];

  constructor(private readonly store: Store<CollabToolsState>) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(getSuggestions)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((results) => {
        if (results) {
          this.suggestions = results.filter(
            (username) => !this.exclusions?.includes(username)
          );
        } else {
          this.suggestions = [];
        }
      });
    this.store.dispatch(GetUserInfos());
  }

  public search(event) {
    this.store.dispatch(SearchUser({ text: event.query }));
  }

  public onSelectUsername(selected: string) {
    this.selectedUsernames.push(selected);
  }

  public onUnSelectUsername(selected: string) {
    this.selectedUsernames = this.selectedUsernames.filter(
      (username) => username !== selected
    );
  }
}
