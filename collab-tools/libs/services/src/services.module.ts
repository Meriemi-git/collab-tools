import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AgentService } from './entities/agent.service';
import { ChatService } from './entities/chat.service';
import { DrawerService } from './entities/drawer.service';
import { FloorService } from './entities/floor.service';
import { GalleryService } from './entities/gallery.service';
import { NotificationService } from './entities/notification.service';
import { RoomService } from './entities/room.service';
import { StratMapService } from './entities/strat-map.service';
import { StratService } from './entities/strat.service';
import { UserService } from './entities/user.service';
import { FontService } from './helpers/font.service';
import { ImageHelperService } from './helpers/image-helper.service';

@NgModule({
  imports: [CommonModule, TranslateModule],
  providers: [
    AgentService,
    DrawerService,
    FontService,
    GalleryService,
    StratService,
    UserService,
    StratMapService,
    ImageHelperService,
    FloorService,
    RoomService,
    ChatService,
    NotificationService,
  ],
})
export class ServicesModule {}