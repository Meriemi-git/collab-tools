import { Component, OnInit } from '@angular/core';
import { UserDto } from '@collab-tools/datamodel';
import {
  CollabToolsState,
  getUserInfos,
  InviteUsersToChat,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'collab-tools-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
})
export class InvitationDialogComponent implements OnInit {
  public $userInfos: Observable<UserDto>;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public store: Store<CollabToolsState>
  ) {}
  ngOnInit(): void {
    this.$userInfos = this.store.select(getUserInfos);
  }

  public onInviteAll(usernames: string[]) {
    this.store.dispatch(InviteUsersToChat({ usernames, chatId: null }));
  }
}
