import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { ProcessService } from '../process.service';
import { Process, ProcessStatus } from '../models/process.model';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './process-list.html',
  styleUrl: './process-list.css'
})
export class ProcessList implements OnInit {
  processes: Process[] = [];
  filteredProcesses: Process[] = [];
  statusOptions: ProcessStatus[] = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];
  nameFilter = '';
  statusFilter: ProcessStatus | '' = '';
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

  applyFilters(): void {
    this.loadProcesses(this.statusFilter || undefined);
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.statusFilter = '';
    this.loadProcesses();
  }

  dropProcess(event: CdkDragDrop<Process[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(this.filteredProcesses, event.previousIndex, event.currentIndex);
  }

  private loadProcesses(status?: ProcessStatus): void {
    this.isLoading = true;
    this.error = null;
    this.fieldErrors = {};

    this.processService
      .getProcesses(undefined, status)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.processes = data ?? [];
          this.applyLocalFilters();
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.processes = [];
          this.filteredProcesses = [];
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
          this.isLoading = false;
        }
      });
  }

  private applyLocalFilters(): void {
    const name = this.nameFilter.trim().toLowerCase();

    this.filteredProcesses = this.processes.filter((process) => {
      return !name || (process.name ?? '').toLowerCase().includes(name);
    });
  }
}
