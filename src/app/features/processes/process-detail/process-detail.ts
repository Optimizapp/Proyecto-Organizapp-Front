import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ProcessService } from '../process.service';
import { Process } from '../models/process.model';

@Component({
  selector: 'app-process-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './process-detail.html',
  styleUrl: './process-detail.css'
})
export class ProcessDetail implements OnInit {
  process?: Process;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.process = undefined;
      this.error = 'El identificador del proceso no es valido.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.processService
      .getProcessById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.process = data;
        },
        error: (error: HttpErrorResponse) => {
          this.process = undefined;
          this.error = this.getErrorMessage(error);
        }
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No fue posible conectar con el servidor. Verifica la red o que el backend este activo.';
    }

    if (error.status === 404) {
      return 'El proceso solicitado no fue encontrado.';
    }

    return 'Ocurrio un error al cargar el proceso.';
  }
}
