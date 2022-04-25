import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { TopBarComponent } from './top-bar.component';

@NgModule({
  declarations: [TopBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    BadgeModule,
  ],
  exports: [TopBarComponent],
})
export class TopBarModule {}
