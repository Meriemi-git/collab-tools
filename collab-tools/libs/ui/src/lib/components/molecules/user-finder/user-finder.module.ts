import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { UserFinderComponent } from './user-finder.component';

@NgModule({
  declarations: [UserFinderComponent],
  imports: [CommonModule, TranslateModule, AutoCompleteModule, ButtonModule],
  exports: [UserFinderComponent],
})
export class UserFinderModule {}
