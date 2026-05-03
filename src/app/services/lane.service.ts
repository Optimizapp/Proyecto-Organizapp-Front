import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateLaneRequest, LaneResponse, UpdateLaneRequest } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class LaneService {
  private readonly apiUrl = `${environment.apiUrl}/lanes`;
  private readonly http = inject(HttpClient);

  getLanes(poolId?: number): Observable<LaneResponse[]> {
    let params = new HttpParams();

    if (poolId !== undefined) {
      params = params.set('poolId', poolId);
    }

    return this.http.get<LaneResponse[]>(this.apiUrl, { params });
  }

  getLaneById(id: number): Observable<LaneResponse> {
    return this.http.get<LaneResponse>(`${this.apiUrl}/${id}`);
  }

  createLane(request: CreateLaneRequest): Observable<LaneResponse> {
    return this.http.post<LaneResponse>(this.apiUrl, request);
  }

  updateLane(id: number, request: UpdateLaneRequest): Observable<LaneResponse> {
    return this.http.put<LaneResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteLane(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
