import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { UserDto } from '@collab-tools/datamodel';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent
  extends AbsctractObserverComponent
  implements OnChanges
{
  @Input() $userInfos: Observable<UserDto>;
  @Input() $notifCounter: Observable<number>;
  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() disconnect = new EventEmitter<void>();

  public menuItems: MenuItem[];

  constructor(
    private readonly router: Router,
    private readonly translationService: TranslateService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.translationService.onLangChange
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        combineLatest([this.$userInfos, this.$notifCounter]).subscribe(
          (updates) => {
            if (updates[0]) {
              const notifLabel = updates[1] > 0 ? ` +${updates[1]}` : '';
              this.menuItems = [
                {
                  label: this.translationService.instant(
                    'top-bar.menu-items.account'
                  ),
                  icon: 'fas fa-user-circle',
                  routerLink: ['/account'],
                },
                {
                  label: `${this.translationService.instant(
                    'top-bar.menu-items.notifications'
                  )}${notifLabel}`,
                  icon: 'pi pi-bell',
                  routerLink: ['/notifications'],
                  styleClass: updates[1] > 0 ? 'notif-highlighted' : '',
                  badge: '12',
                  badgeStyleClass: 'badge yolo',
                },
                {
                  label: this.translationService.instant(
                    'top-bar.menu-items.disconnection'
                  ),
                  icon: 'fas fa-sign-out-alt',
                  command: () => this.disconnect.emit(),
                },
              ];
            } else {
              this.menuItems = [
                {
                  label: this.translationService.instant(
                    'top-bar.menu-items.login'
                  ),
                  icon: 'fas fa-sign-in-alt',
                  badge: '3',
                  command: () => this.login.emit(),
                },
                {
                  label: this.translationService.instant(
                    'top-bar.menu-items.register'
                  ),
                  icon: 'fas fa-user-plus',
                  badge: '3',
                  command: () => this.register.emit(),
                },
              ];
            }
          }
        );
      });
  }

  onAccountClick() {
    this.router.navigateByUrl('/account');
  }

  onHomeClick() {
    this.router.navigateByUrl('/');
  }

  onEditorClick() {
    this.router.navigateByUrl('/editor');
  }

  onMyDrawClick() {
    this.router.navigateByUrl('/my-draws');
  }

  onSharedDrawClick() {
    this.router.navigateByUrl('/shared-draws');
  }
}
