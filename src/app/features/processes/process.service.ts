import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateProcessRequest,
  Process,
  ProcessResponse,
  ProcessStatus,
  UpdateProcessRequest
} from '../../core/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private readonly apiUrl = `${environment.apiUrl}/processes`;

  constructor(private http: HttpClient) {}

  getProcesses(companyId?: number, status?: ProcessStatus): Observable<ProcessResponse[]> {
    let params = new HttpParams();

    if (companyId !== undefined) {
      params = params.set('companyId', companyId);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ProcessResponse[]>(this.apiUrl, { params });
  }

  getProcessById(id: number): Observable<ProcessResponse> {
    return this.http.get<ProcessResponse>(`${this.apiUrl}/${id}`);
  }

  createProcess(request: CreateProcessRequest): Observable<ProcessResponse> {
    return this.http.post<ProcessResponse>(this.apiUrl, request);
  }

  updateProcess(id: number, request: UpdateProcessRequest): Observable<ProcessResponse> {
    return this.http.put<ProcessResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteProcess(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
