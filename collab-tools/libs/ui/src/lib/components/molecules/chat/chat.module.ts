import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WebsocketModule } from '@collab-tools/websocket';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChatComponent } from './chat.component';
@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    AvatarModule,
    AvatarGroupModule,
    WebsocketModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    ScrollPanelModule,
    ChipModule,
  ],
  exports: [ChatComponent],
})
export class ChatModule {}
