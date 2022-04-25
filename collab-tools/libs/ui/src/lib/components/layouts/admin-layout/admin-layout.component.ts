import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { UserDto } from '@collab-tools/datamodel';
import {
  Disconnect,
  getMessage,
  getUserInfos,
  LogIn,
  StratEditorState,
} from '@collab-tools/store';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginDialogComponent } from '../../molecules/login-dialog/login-dialog.component';

@Component({
  selector: 'collab-tools-admin-page',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent
  extends AbsctractObserverComponent
  implements OnInit, OnDestroy
{
  public $userInfos: Observable<UserDto>;
  public menuItems: MenuItem[];
  private loginDialog: DynamicDialogRef;

  constructor(
    private readonly store: Store<StratEditorState>,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly translationService: TranslateService
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.loginDialog.close();
  }

  ngOnInit(): void {
    this.$userInfos = this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber));
    this.$userInfos
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((userInfos) => {
        if (userInfos) {
          this.menuItems = [
            {
              label: 'Deconnexion',
              command: () => {
                this.onDisconnect();
              },
            },
          ];
        } else {
          this.menuItems = [
            {
              label: 'Login',
              command: () => {
                this.onLogin();
              },
            },
          ];
        }
      });
    this.store
      .select(getMessage)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((message) => {
        if (message) {
          this.translationService
            .get([message.titleKey, message.messageKey])
            .subscribe((translations) => {
              if (translations) {
                this.messageService.add({
                  severity: message.level,
                  summary: translations[message.titleKey],
                  detail: translations[message.messageKey],
                });
              }
            });
        }
      });
  }

  onDisconnect() {
    this.store.dispatch(Disconnect({ withNotif: true }));
  }

  onHomeClick() {
    this.router.navigateByUrl('/admin');
  }

  onLogin() {
    this.loginDialog = this.dialogService.open(LoginDialogComponent, {
      showHeader: false,
    });
    this.loginDialog.onClose
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((userDto: UserDto) => {
        if (userDto) {
          this.store.dispatch(LogIn({ userDto }));
        }
      });
  }
}
