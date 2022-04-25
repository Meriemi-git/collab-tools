import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatMessage } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly controller = 'chats';

  constructor(private readonly http: HttpClient) {}

  public getAllChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      `${environment.apiUrl}/${this.controller}/all`
    );
  }

  public createChat(members: string[]): Observable<Chat> {
    return this.http.post<Chat>(
      `${environment.apiUrl}/${this.controller}`,
      members
    );
  }

  public joinChat(chatId: string): Observable<Chat> {
    return this.http.patch<Chat>(
      `${environment.apiUrl}/${this.controller}/join/${chatId}`,
      null
    );
  }

  public leaveChat(chatId: string): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/${this.controller}/leave/${chatId}`,
      null
    );
  }

  public getLastChatMessages(
    chatId: string,
    time: Date
  ): Observable<ChatMessage[]> {
    return this.http.post<ChatMessage[]>(
      `${environment.apiUrl}/${this.controller}/messages/${chatId}`,
      { time }
    );
  }

  public inviteUsersToChat(
    chatId: string,
    usernames: string[]
  ): Observable<Chat> {
    return this.http.patch<Chat>(
      `${environment.apiUrl}/${this.controller}/invite/${chatId}`,
      {
        usernames,
      }
    );
  }

  public sendChatMessage(
    chatId: string,
    content: string
  ): Observable<ChatMessage> {
    return this.http.patch<ChatMessage>(
      `${environment.apiUrl}/${this.controller}/message/${chatId}`,
      {
        content,
      }
    );
  }
}
