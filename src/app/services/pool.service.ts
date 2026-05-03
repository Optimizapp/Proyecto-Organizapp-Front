import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreatePoolRequest, PoolResponse, UpdatePoolRequest } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class PoolService {
  private readonly apiUrl = `${environment.apiUrl}/pools`;
  private readonly http = inject(HttpClient);

  getPools(companyId?: number): Observable<PoolResponse[]> {
    let params = new HttpParams();

    if (companyId !== undefined) {
      params = params.set('companyId', companyId);
    }

    return this.http.get<PoolResponse[]>(this.apiUrl, { params });
  }

  getPoolById(id: number): Observable<PoolResponse> {
    return this.http.get<PoolResponse>(`${this.apiUrl}/${id}`);
  }

  createPool(request: CreatePoolRequest): Observable<PoolResponse> {
    return this.http.post<PoolResponse>(this.apiUrl, request);
  }

  updatePool(id: number, request: UpdatePoolRequest): Observable<PoolResponse> {
    return this.http.put<PoolResponse>(`${this.apiUrl}/${id}`, request);
  }

  deletePool(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
