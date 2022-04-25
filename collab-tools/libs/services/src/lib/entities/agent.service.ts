import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agent } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private readonly controller = 'agents';

  constructor(private readonly http: HttpClient) {}

  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(
      `${environment.apiUrl}/${this.controller}/all`
    );
  }

  addAgent(data: FormData): Observable<Agent> {
    return this.http.post<Agent>(
      `${environment.apiUrl}/${this.controller}`,
      data
    );
  }

  updateAgent(data: FormData): Observable<Agent> {
    return this.http.patch<Agent>(
      `${environment.apiUrl}/${this.controller}`,
      data
    );
  }

  deleteAgent(agentId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${agentId}`
    );
  }
}
