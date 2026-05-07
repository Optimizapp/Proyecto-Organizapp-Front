import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Process } from './models/process.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  // TODO: reemplazar mock por consumo real del backend.
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
    return of(this.processes.find(process => process.id === id));
  }

  createProcess(processData: Omit<Process, 'id'>): Observable<Process> {
    const newProcess: Process = {
      ...processData,
      id: this.generateId()
    };

    this.processes.push(newProcess);

    return of(newProcess);
  }

  updateProcess(id: number, processData: Omit<Process, 'id'>): Observable<Process | undefined> {
    const index = this.processes.findIndex(process => process.id === id);

    if (index === -1) {
      return of(undefined);
    }

    this.processes[index] = {
      ...this.processes[index],
      ...processData,
      id
    };

    return of(this.processes[index]);
  }

  private generateId(): number {
    if (this.processes.length === 0) {
      return 1;
    }

    return Math.max(...this.processes.map(process => process.id)) + 1;
  }
}