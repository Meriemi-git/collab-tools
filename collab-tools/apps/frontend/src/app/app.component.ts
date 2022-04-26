import { Component, OnInit } from '@angular/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { getUserLocale, UserState } from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends AbsctractObserverComponent implements OnInit {
  constructor(
    private readonly primengConfig: PrimeNGConfig,
    private readonly translateService: TranslateService,
    private readonly store: Store<UserState>
  ) {
    super();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.translateService
      .get('primeng')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((res) => this.primengConfig.setTranslation(res));
    this.store.select(getUserLocale).subscribe((locale) => {
      if (locale) {
        this.translate(locale);
      } else {
        const lang = this.translateService.getBrowserLang();
        this.translate(lang);
      }
    });
  }

  private translate(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((res) => this.primengConfig.setTranslation(res));
  }
}
