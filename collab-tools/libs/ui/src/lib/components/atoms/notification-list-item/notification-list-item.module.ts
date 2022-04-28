import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { NotificationListItemComponent } from './notification-list-item.component';

@NgModule({
  declarations: [NotificationListItemComponent],
  imports: [CommonModule, TranslateModule, ButtonModule],
  exports: [NotificationListItemComponent],
})
export class NotificationListItemModule {}
