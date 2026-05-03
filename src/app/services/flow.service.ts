import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FlowRequest, FlowResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  private readonly apiUrl = `${environment.apiUrl}/flows`;
  private readonly http = inject(HttpClient);

  getFlows(versionId: number): Observable<FlowResponse[]> {
    const params = new HttpParams().set('versionId', versionId);
    return this.http.get<FlowResponse[]>(this.apiUrl, { params });
  }

  getFlowById(id: number): Observable<FlowResponse> {
    return this.http.get<FlowResponse>(`${this.apiUrl}/${id}`);
  }

  createFlow(request: FlowRequest): Observable<FlowResponse> {
    return this.http.post<FlowResponse>(this.apiUrl, request);
  }

  updateFlow(id: number, request: FlowRequest): Observable<FlowResponse> {
    return this.http.put<FlowResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteFlow(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
