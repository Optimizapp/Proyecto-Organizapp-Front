import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NodeRequest, NodeResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private readonly apiUrl = `${environment.apiUrl}/nodes`;
  private readonly http = inject(HttpClient);

  getNodes(versionId: number): Observable<NodeResponse[]> {
    const params = new HttpParams().set('versionId', versionId);
    return this.http.get<NodeResponse[]>(this.apiUrl, { params });
  }

  getNodeById(id: number): Observable<NodeResponse> {
    return this.http.get<NodeResponse>(`${this.apiUrl}/${id}`);
  }

  createNode(request: NodeRequest): Observable<NodeResponse> {
    return this.http.post<NodeResponse>(this.apiUrl, request);
  }

  updateNode(id: number, request: NodeRequest): Observable<NodeResponse> {
    return this.http.put<NodeResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteNode(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
