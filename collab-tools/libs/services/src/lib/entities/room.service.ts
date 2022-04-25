import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly controller = 'rooms';

  constructor(private readonly http: HttpClient) {}

  public createRoom(): Observable<Room> {
    return this.http.post<Room>(
      `${environment.apiUrl}/${this.controller}`,
      null
    );
  }

  public getOwnRoom(): Observable<Room> {
    return this.http.get<Room>(`${environment.apiUrl}/${this.controller}/own`);
  }

  public getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(
      `${environment.apiUrl}/${this.controller}/all`
    );
  }

  public inviteUsersToRoom(
    usernames: string[],
    roomId: string
  ): Observable<Room> {
    return this.http.post<Room>(
      `${environment.apiUrl}/${this.controller}/invite/${roomId}`,
      {
        usernames,
      }
    );
  }

  public joinRoom(roomId: string): Observable<Room> {
    return this.http.patch<Room>(
      `${environment.apiUrl}/${this.controller}/join/${roomId}`,
      null
    );
  }

  public leaveRoom(roomId: string): Observable<Room> {
    return this.http.patch<Room>(
      `${environment.apiUrl}/${this.controller}/leave/${roomId}`,
      null
    );
  }

  public ejectUsersFromRoom(roomId: string, userId: string): Observable<Room> {
    return this.http.patch<Room>(
      `${environment.apiUrl}/${this.controller}/${roomId}/eject/${userId}`,
      null
    );
  }

  public closeRoom(): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/${this.controller}/close`,
      null
    );
  }
}
