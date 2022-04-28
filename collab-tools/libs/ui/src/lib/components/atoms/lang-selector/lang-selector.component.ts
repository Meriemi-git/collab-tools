import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { Language } from '@collab-tools/datamodel';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss'],
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
