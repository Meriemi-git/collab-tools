import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChatService } from './entities/chat.service';
import { DrawService } from './entities/draw.service';
import { DrawerService } from './entities/drawer.service';
import { GalleryService } from './entities/gallery.service';
import { NotificationService } from './entities/notification.service';
import { RoomService } from './entities/room.service';
import { UserService } from './entities/user.service';
import { FontService } from './helpers/font.service';
import { ImageHelperService } from './helpers/image-helper.service';

@NgModule({
  imports: [CommonModule, TranslateModule],
  providers: [
    DrawerService,
    FontService,
    GalleryService,
    DrawService,
    UserService,
    ImageHelperService,
    RoomService,
    ChatService,
    NotificationService,
  ],
})
export class ServicesModule {}
