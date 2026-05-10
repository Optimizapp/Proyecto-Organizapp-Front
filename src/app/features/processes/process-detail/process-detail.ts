import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/services/api-error.service';
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
  fieldErrors: Record<string, string> = {};

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.process = undefined;
      this.error = 'El identificador del proceso no es valido.';
      this.fieldErrors = {};
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.fieldErrors = {};

    this.processService
      .getProcessById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.process = data;
        },
        error: (error: unknown) => {
          this.process = undefined;
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }
}
