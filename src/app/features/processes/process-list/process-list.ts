import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/services/api-error.service';
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
  fieldErrors: Record<string, string> = {};

  constructor(
    private processService: ProcessService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  private loadProcesses(): void {
    this.isLoading = true;
    this.error = null;
    this.fieldErrors = {};

    this.processService
      .getProcesses()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.processes = data;
        },
        error: (error: unknown) => {
          this.processes = [];
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }
}
