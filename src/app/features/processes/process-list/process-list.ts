import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ProcessService } from '../process.service';
import { Process } from '../models/process.model';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css'
})
export class ProcessList implements OnInit {
  processes: Process[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  private loadProcesses(): void {
    this.isLoading = true;
    this.error = null;

    this.processService
      .getProcesses()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.processes = data;
        },
        error: (error: HttpErrorResponse) => {
          this.processes = [];
          this.error = this.getErrorMessage(error);
        }
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No fue posible conectar con el servidor. Verifica la red o que el backend este activo.';
    }

    if (error.status === 404) {
      return 'No se encontro el recurso de procesos en el backend.';
    }

    return 'Ocurrio un error al cargar los procesos. Intenta nuevamente.';
  }
}
