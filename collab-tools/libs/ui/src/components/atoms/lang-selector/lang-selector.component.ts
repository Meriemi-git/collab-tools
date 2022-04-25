import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '@collab-tools/datamodel';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-lang-selector',
  templateUrl: './lang-selector.component.html',
})
export class LangSelectorComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  @Output() langSelected = new EventEmitter<Language>();
  public langs: Language[] = [];
  constructor(private readonly translationService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.translationService
      .get('lang.english')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((label) => {
        this.langs.push({
          name: label,
          locale: 'en',
        });
      });
    this.translationService
      .get('lang.french')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((label) => {
        this.langs.push({
          name: label,
          locale: 'fr',
        });
      });
  }

  onLangSelected(lang: Language) {
    this.langSelected.emit(lang);
  }
}
