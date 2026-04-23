import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Process } from './models/process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  // TODO: reemplazar mock por consumo real del backend
  // Ejemplo futuro:
  // private apiUrl = 'http://localhost:8080/api/processes';

  private processes: Process[] = [
    {
      id: 1,
      name: 'Proceso de ventas',
      description: 'Proceso base de ventas',
      status: 'Activo'
    },
    {
      id: 2,
      name: 'Proceso de compras',
      description: 'Proceso base de compras',
      status: 'Borrador'
    }
  ];

  getProcesses(): Observable<Process[]> {
    return of(this.processes);
  }

  getProcessById(id: number): Observable<Process | undefined> {
    return of(this.processes.find(p => p.id === id));
  }
}