import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiErrorService } from '../../../core/services/api-error.service';
import { CreateProcessRequest, ProcessStatus, UpdateProcessRequest } from '../models/process.model';
import { ProcessService } from '../process.service';

@Component({
  selector: 'app-process-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './process-form.html',
  styleUrl: './process-form.css'
})
export class ProcessForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly statusOptions: ProcessStatus[] = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

  processId?: number;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  fieldErrors: Record<string, string> = {};

  processForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    category: [''],
    status: ['DRAFT' as ProcessStatus, Validators.required],
    companyId: [null as number | null, [Validators.required, Validators.min(1)]],
    userId: [null as number | null, [Validators.required, Validators.min(1)]],
    mainPoolId: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private processService: ProcessService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam) {
      return;
    }

    if (Number.isNaN(id) || id <= 0) {
      this.error = 'El identificador del proceso no es valido.';
      return;
    }

    this.processId = id;
    this.isEditMode = true;
    this.loadProcess(id);
  }

  saveProcess(): void {
    this.error = null;
    this.fieldErrors = {};

    if (this.processForm.invalid) {
      this.processForm.markAllAsTouched();
      return;
    }

    const request = this.buildRequest();
    this.isSubmitting = true;

    const save$ = this.isEditMode && this.processId
      ? this.processService.updateProcess(this.processId, request as UpdateProcessRequest)
      : this.processService.createProcess(request as CreateProcessRequest);

    save$
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (process) => {
          this.router.navigate(['/processes', process.id]);
        },
        error: (error: unknown) => {
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/processes']);
  }

  isInvalid(fieldName: keyof typeof this.processForm.controls): boolean {
    const field = this.processForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  private loadProcess(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.fieldErrors = {};

    this.processService
      .getProcessById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (process) => {
          this.processForm.patchValue({
            name: process.name,
            description: process.description ?? '',
            category: process.category ?? '',
            status: process.status,
            companyId: process.companyId,
            userId: process.userId,
            mainPoolId: process.mainPoolId
          });
        },
        error: (error: unknown) => {
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }

  private buildRequest(): CreateProcessRequest | UpdateProcessRequest {
    const value = this.processForm.getRawValue();

    return {
      name: value.name?.trim() ?? '',
      description: value.description?.trim() || undefined,
      category: value.category?.trim() || undefined,
      status: value.status ?? 'DRAFT',
      companyId: Number(value.companyId),
      userId: Number(value.userId),
      mainPoolId: Number(value.mainPoolId)
    };
  }
}
