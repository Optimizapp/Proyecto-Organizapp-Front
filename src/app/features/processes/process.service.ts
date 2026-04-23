import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Process } from './models/process.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private readonly apiUrl = `${environment.apiUrl}/processes`;

  constructor(private http: HttpClient) {}

  getProcesses(): Observable<Process[]> {
    return this.http.get<Process[]>(this.apiUrl);
  }

  getProcessById(id: number): Observable<Process> {
    return this.http.get<Process>(`${this.apiUrl}/${id}`);
  }

  createProcess(process: Process): Observable<Process> {
    return this.http.post<Process>(this.apiUrl, process);
  }

  updateProcess(id: number, process: Process): Observable<Process> {
    return this.http.put<Process>(`${this.apiUrl}/${id}`, process);
  }

  deleteProcess(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
