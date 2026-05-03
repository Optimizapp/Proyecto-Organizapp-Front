import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleRequest, RoleResponse } from '../core/models';

export interface RoleFilters {
  companyId?: number;
  processId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = `${environment.apiUrl}/roles`;
  private readonly http = inject(HttpClient);

  getRoles(filters: RoleFilters = {}): Observable<RoleResponse[]> {
    let params = new HttpParams();

    if (filters.companyId !== undefined) {
      params = params.set('companyId', filters.companyId);
    }

    if (filters.processId !== undefined) {
      params = params.set('processId', filters.processId);
    }

    return this.http.get<RoleResponse[]>(this.apiUrl, { params });
  }

  createRole(request: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.apiUrl, request);
  }

  updateRole(id: number, request: RoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
