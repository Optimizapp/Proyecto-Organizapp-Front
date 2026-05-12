import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  CompanyResponse,
  CreatePoolRequest,
  FormErrorMap,
  UpdatePoolRequest
} from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';
import { PoolService } from '../../../services/pool.service';

@Component({
  selector: 'app-pool-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="feature-page">
      <div class="page-header">
        <div>
          <h2>{{ isEditMode ? 'Editar pool' : 'Nuevo pool' }}</h2>
          <p>Crea un pool asociado a una empresa real.</p>
        </div>
        <a routerLink="/pools" class="text-action">Volver</a>
      </div>

      <div *ngIf="isLoading" class="state-message">Cargando pool...</div>
      <div *ngIf="error" class="state-message error">{{ error }}</div>

      <form [formGroup]="poolForm" (ngSubmit)="savePool()" class="form-grid">
        <label>
          Nombre
          <input type="text" formControlName="name" />
          <small *ngIf="isInvalid('name')">El nombre es obligatorio.</small>
          <small *ngIf="fieldErrors['name']">{{ fieldErrors['name'] }}</small>
        </label>

        <label>
          Empresa
          <select formControlName="companyId">
            <option [ngValue]="null">
              {{ isLoadingCompanies ? 'Cargando empresas...' : 'Seleccione una empresa' }}
            </option>
            <option *ngFor="let company of companies" [ngValue]="company.id">
              {{ getCompanyLabel(company) }}
            </option>
          </select>
          <small *ngIf="isInvalid('companyId')">La empresa es obligatoria.</small>
        </label>

        <label>
          Descripcion
          <textarea formControlName="description" rows="3"></textarea>
        </label>

        <div class="form-actions">
          <button type="submit" [disabled]="isSaving">
            {{ isSaving ? 'Guardando...' : 'Guardar pool' }}
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .text-action {
        color: var(--accent-color);
        font-weight: 600;
        text-decoration: none;
      }

      .form-grid {
        display: grid;
        gap: 1rem;
        max-width: 720px;
      }

      label {
        display: grid;
        gap: 0.45rem;
        font-weight: 600;
      }

      input,
      select,
      textarea {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        font: inherit;
      }

      small {
        color: #b42318;
      }

      .state-message {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 1rem;
        margin-bottom: 1rem;
        color: var(--text-secondary);
      }

      .error {
        color: #b42318;
        border-color: #fda29b;
        background: #fff1f0;
      }

      button {
        border: 0;
        border-radius: var(--radius-sm);
        background: var(--accent-color);
        color: #fff;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 0.8rem 1.1rem;
      }
    `
  ]
})
export class PoolForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  isLoadingCompanies = false;
  error: string | null = null;
  fieldErrors: FormErrorMap = {};
  companies: CompanyResponse[] = [];
  private poolId: number | null = null;

  poolForm = this.formBuilder.group({
    name: ['', Validators.required],
    companyId: [null as number | null, Validators.required],
    description: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private poolService: PoolService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.isEditMode = true;
      this.poolId = id;
      this.loadPool(id);
    }
  }

  savePool(): void {
    this.error = null;
    this.fieldErrors = {};

    if (this.poolForm.invalid) {
      this.poolForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const request = this.buildRequest();
    const operation =
      this.isEditMode && this.poolId
        ? this.poolService.updatePool(this.poolId, request as UpdatePoolRequest)
        : this.poolService.createPool(request as CreatePoolRequest);

    operation.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.router.navigate(['/pools']),
      error: (error: unknown) => this.applyError(error)
    });
  }

  isInvalid(fieldName: keyof typeof this.poolForm.controls): boolean {
    const field = this.poolForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  getCompanyLabel(company: CompanyResponse): string {
    return company.nit ? `${company.name} - ${company.nit}` : company.name;
  }

  private loadCompanies(): void {
    this.isLoadingCompanies = true;
    this.poolForm.controls.companyId.disable();
    this.companyService
      .getCompanies()
      .pipe(
        finalize(() => {
          this.isLoadingCompanies = false;
          this.poolForm.controls.companyId.enable();
        })
      )
      .subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  private loadPool(id: number): void {
    this.isLoading = true;
    this.poolService
      .getPoolById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (pool) => {
          this.poolForm.patchValue({
            name: pool.name,
            companyId: pool.companyId,
            description: pool.description ?? ''
          });
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  private buildRequest(): CreatePoolRequest | UpdatePoolRequest {
    const value = this.poolForm.getRawValue();
    return {
      name: value.name ?? '',
      companyId: Number(value.companyId),
      description: value.description || undefined
    };
  }

  private applyError(error: unknown): void {
    this.error = this.apiErrorService.getMessage(error);
    this.fieldErrors = this.apiErrorService.getFieldErrors(error);
  }
}
