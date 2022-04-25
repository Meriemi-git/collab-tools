import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationListModule } from '../../molecules/notification-list/notification-list.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [CommonModule, NotificationsRoutingModule, NotificationListModule],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
