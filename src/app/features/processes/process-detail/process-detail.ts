import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
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
export class ProcessDetail implements OnInit, OnDestroy {
  process?: Process;
  isLoading = false;
  error: string | null = null;
  fieldErrors: Record<string, string> = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const idParam = params.get('id');
      const id = Number(idParam);

      if (!idParam || Number.isNaN(id) || id <= 0) {
        this.process = undefined;
        this.error = 'El identificador del proceso no es valido.';
        this.fieldErrors = {};
        this.isLoading = false;
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}