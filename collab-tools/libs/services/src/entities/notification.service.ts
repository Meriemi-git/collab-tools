import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly controller = 'notifications';

  constructor(private readonly http: HttpClient) {}

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${environment.apiUrl}/${this.controller}`
    );
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${notificationId}`
    );
  }
}
