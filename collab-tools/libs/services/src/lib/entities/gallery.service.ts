import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly controller = 'gallery';

  constructor(private readonly http: HttpClient) {}

  public getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(
      `${environment.apiUrl}/${this.controller}/images`
    );
  }

  public uploadImage(image: File): Observable<Image> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<Image>(
      `${environment.apiUrl}/${this.controller}/upload`,
      formData
    );
  }

  public deleteImage(image: Image): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${image._id}`
    );
  }
}
