import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

    return this.http
      .get<BackendRoleResponse[]>(this.apiUrl, { params })
      .pipe(map((roles) => roles.map((role) => this.mapRoleResponse(role))));
  }

  createRole(request: RoleRequest): Observable<RoleResponse> {
    return this.http
      .post<BackendRoleResponse>(this.apiUrl, request)
      .pipe(map((role) => this.mapRoleResponse(role)));
  }

  updateRole(id: number, request: RoleRequest): Observable<RoleResponse> {
    return this.http
      .put<BackendRoleResponse>(`${this.apiUrl}/${id}`, request)
      .pipe(map((role) => this.mapRoleResponse(role)));
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapRoleResponse(role: BackendRoleResponse): RoleResponse {
    return {
      id: role.id,
      name: role.name ?? role.nombre ?? '',
      companyId: role.companyId,
      processId: role.processId ?? null,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  }
}

interface BackendRoleResponse {
  id: number;
  name?: string;
  nombre?: string;
  companyId?: number;
  processId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
