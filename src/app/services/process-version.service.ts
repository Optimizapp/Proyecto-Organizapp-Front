import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProcessVersionRequest, ProcessVersionResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class ProcessVersionService {
  private readonly apiUrl = `${environment.apiUrl}/process-versions`;
  private readonly http = inject(HttpClient);

  getVersions(processId: number): Observable<ProcessVersionResponse[]> {
    const params = new HttpParams().set('processId', processId);
    return this.http.get<ProcessVersionResponse[]>(this.apiUrl, { params });
  }

  getVersionById(id: number): Observable<ProcessVersionResponse> {
    return this.http.get<ProcessVersionResponse>(`${this.apiUrl}/${id}`);
  }

  createVersion(request: ProcessVersionRequest): Observable<ProcessVersionResponse> {
    return this.http.post<ProcessVersionResponse>(this.apiUrl, request);
  }

  updateVersion(id: number, request: ProcessVersionRequest): Observable<ProcessVersionResponse> {
    return this.http.put<ProcessVersionResponse>(`${this.apiUrl}/${id}`, request);
  }

  publishVersion(id: number): Observable<ProcessVersionResponse> {
    return this.http.post<ProcessVersionResponse>(`${this.apiUrl}/${id}/publish`, {});
  }
}
