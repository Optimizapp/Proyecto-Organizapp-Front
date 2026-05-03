import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PermissionRequest, PermissionResponse } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly apiUrl = `${environment.apiUrl}/permissions`;
  private readonly http = inject(HttpClient);

  getPermissions(roleId?: number): Observable<PermissionResponse[]> {
    let params = new HttpParams();

    if (roleId !== undefined) {
      params = params.set('roleId', roleId);
    }

    return this.http.get<PermissionResponse[]>(this.apiUrl, { params });
  }

  createPermission(request: PermissionRequest): Observable<PermissionResponse> {
    return this.http.post<PermissionResponse>(this.apiUrl, request);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
