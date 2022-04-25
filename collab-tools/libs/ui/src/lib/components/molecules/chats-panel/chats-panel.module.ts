import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { TabViewModule } from 'primeng/tabview';
import { ChatModule } from '../chat/chat.module';
import { InvitationDialogModule } from '../invitation-dialog/invitation-dialog.module';
import { UserFinderModule } from '../user-finder/user-finder.module';
import { ChatsPanelComponent } from './chats-panel.component';

@NgModule({
  declarations: [ChatsPanelComponent],
  imports: [
    CommonModule,
    TabViewModule,
    ButtonModule,
    AvatarModule,
    AvatarGroupModule,
    ChatModule,
    ListboxModule,
    TranslateModule,
    BadgeModule,
    DynamicDialogModule,
    InvitationDialogModule,
    UserFinderModule,
  ],
  exports: [ChatsPanelComponent],
})
export class ChatsPanelModule {}
