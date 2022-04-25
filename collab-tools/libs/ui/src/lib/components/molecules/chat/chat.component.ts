import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chat, ChatMessage, WebsocketStatus } from '@collab-tools/datamodel';
import { ScrollPanel } from 'primeng/scrollpanel';

@Component({
  selector: 'collab-tools-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @ViewChild('scrollPanel')
  public scrollPanel: ScrollPanel;
  @Input()
  public messages: ChatMessage[];
  @Input()
  public chat: Chat;
  @Input()
  public userId: string;
  @Output()
  public sendMessage = new EventEmitter<string>();
  @Output()
  public loadMore = new EventEmitter<void>();
  @Output()
  public closeChat = new EventEmitter<void>();
  @Output()
  public inviteUsers = new EventEmitter<void>();

  public WStatus = WebsocketStatus;
  public text: string;
  private dataModified = false;
  private scrollTop = false;
  private scrollDown = false;

  ngOnInit(): void {
    this.dataModified = true;
    this.scrollDown = true;
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.dataModified = true;
    this.scrollDown = true;
  }

  ngAfterViewChecked(): void {
    if (this.dataModified) {
      if (this.scrollTop) {
        this.scrollPanel.scrollTop(1);
      } else if (this.scrollDown) {
        this.scrollPanel.scrollTop(
          this.scrollPanel.contentViewChild.nativeElement.scrollHeight
        );
      }
      this.scrollDown = false;
      this.scrollTop = false;
      this.dataModified = false;
    }
  }

  public loadMoreMessages() {
    this.scrollTop = true;
    this.loadMore.emit();
  }

  public onSendMessage() {
    this.scrollDown = true;
    if (this.text != null && this.text.length) {
      this.scrollDown = true;
      this.sendMessage.emit(this.text);
      this.text = '';
    }
  }
}
