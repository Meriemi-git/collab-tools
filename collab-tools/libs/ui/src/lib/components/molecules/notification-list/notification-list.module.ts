import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { PipesModule } from '../../../lib/pipes.module';
import { NotificationListItemModule } from '../../atoms/notification-list-item/notification-list-item.module';
import { NotificationListComponent } from './notification-list.component';
@NgModule({
  declarations: [NotificationListComponent],
  imports: [
    CommonModule,
    ListboxModule,
    NotificationListItemModule,
    TranslateModule,
    PipesModule,
    DividerModule,
  ],
  exports: [NotificationListComponent],
})
export class NotificationListModule {}
