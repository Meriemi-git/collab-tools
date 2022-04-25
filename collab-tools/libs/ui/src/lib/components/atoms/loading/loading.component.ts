import { Component, Input } from '@angular/core';

@Component({
  selector: 'collab-tools-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input()
  public title: string;
  @Input()
  public message: string;
}
