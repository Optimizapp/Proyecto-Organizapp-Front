import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { CompanyResponse, FormErrorMap, LaneResponse, PoolResponse } from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';
import { LaneService } from '../../../services/lane.service';
import { PoolService } from '../../../services/pool.service';

@Component({
  selector: 'app-lane-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="feature-page">
      <h2>Lanes</h2>
      <p>Lanes reales asociadas a pools.</p>

      <div *ngIf="error" class="state-message error">{{ error }}</div>

      <form [formGroup]="filterForm" class="toolbar">
        <label>
          Empresa
          <select formControlName="companyId" (change)="onCompanyChange()" [disabled]="isLoadingCompanies">
            <option [ngValue]="null">
              {{ isLoadingCompanies ? 'Cargando empresas...' : 'Seleccione una empresa' }}
            </option>
            <option *ngFor="let company of companies" [ngValue]="company.id">
              {{ getCompanyLabel(company) }}
            </option>
          </select>
        </label>

        <label>
          Pool
          <select formControlName="poolId" (change)="onPoolChange()" [disabled]="isLoadingPools || !filterForm.controls.companyId.value">
            <option [ngValue]="null">
              {{ isLoadingPools ? 'Cargando pools...' : 'Seleccione un pool' }}
            </option>
            <option *ngFor="let pool of pools" [ngValue]="pool.id">{{ pool.name }}</option>
          </select>
        </label>
      </form>

      <form [formGroup]="laneForm" (ngSubmit)="createLane()" class="inline-form">
        <label>
          Nombre de lane
          <input type="text" formControlName="name" />
          <small *ngIf="isLaneInvalid('name')">El nombre de la lane es obligatorio.</small>
          <small *ngIf="fieldErrors['name']">{{ fieldErrors['name'] }}</small>
        </label>

        <label>
          Descripcion
          <input type="text" formControlName="description" />
        </label>

        <button type="submit" [disabled]="isSaving || !filterForm.controls.poolId.value">
          {{ isSaving ? 'Creando...' : 'Crear lane' }}
        </button>
      </form>

      <div *ngIf="isLoadingLanes" class="state-message">Cargando lanes...</div>
      <div *ngIf="!isLoadingLanes && filterForm.controls.poolId.value && lanes.length === 0" class="state-message">
        No hay lanes registradas para el pool seleccionado.
      </div>

      <div *ngIf="lanes.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Pool</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let lane of lanes">
              <td>{{ lane.id }}</td>
              <td>{{ lane.name }}</td>
              <td>{{ lane.poolId }}</td>
              <td>{{ lane.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .toolbar,
      .inline-form {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: end;
        margin-bottom: 1.25rem;
      }

      label {
        display: grid;
        gap: 0.45rem;
        min-width: 240px;
        font-weight: 600;
      }

      input,
      select {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        font: inherit;
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

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 0.85rem;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
      }
    `
  ]
})
export class LaneList implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  companies: CompanyResponse[] = [];
  pools: PoolResponse[] = [];
  lanes: LaneResponse[] = [];
  isLoadingCompanies = false;
  isLoadingPools = false;
  isLoadingLanes = false;
  isSaving = false;
  error: string | null = null;
  fieldErrors: FormErrorMap = {};

  filterForm = this.formBuilder.group({
    companyId: [null as number | null, Validators.required],
    poolId: [null as number | null, Validators.required]
  });

  laneForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['']
  });

  constructor(
    private companyService: CompanyService,
    private poolService: PoolService,
    private laneService: LaneService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  onCompanyChange(): void {
    this.filterForm.patchValue({ poolId: null });
    this.pools = [];
    this.lanes = [];
    this.error = null;

    const companyId = this.getSelectedCompanyId();
    if (companyId) {
      this.loadPools(companyId);
    }
  }

  onPoolChange(): void {
    this.lanes = [];
    this.error = null;

    const poolId = this.getSelectedPoolId();
    if (poolId) {
      this.loadLanes(poolId);
    }
  }

  createLane(): void {
    this.error = null;
    this.fieldErrors = {};

    const poolId = this.getSelectedPoolId();
    if (this.laneForm.invalid || !poolId) {
      this.laneForm.markAllAsTouched();
      this.filterForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.laneService
      .createLane({
        name: this.laneForm.controls.name.value ?? '',
        poolId,
        description: this.laneForm.controls.description.value || undefined
      })
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.laneForm.reset();
          this.loadLanes(poolId);
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  isLaneInvalid(fieldName: keyof typeof this.laneForm.controls): boolean {
    const field = this.laneForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  getCompanyLabel(company: CompanyResponse): string {
    return company.nit ? `${company.name} - ${company.nit}` : company.name;
  }

  private loadCompanies(): void {
    this.isLoadingCompanies = true;
    this.companyService
      .getCompanies()
      .pipe(finalize(() => (this.isLoadingCompanies = false)))
      .subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  private loadPools(companyId: number): void {
    this.isLoadingPools = true;
    this.poolService
      .getPools(companyId)
      .pipe(finalize(() => (this.isLoadingPools = false)))
      .subscribe({
        next: (pools) => {
          this.pools = pools;
        },
        error: (error: unknown) => {
          this.pools = [];
          this.applyError(error);
        }
      });
  }

  private loadLanes(poolId: number): void {
    this.isLoadingLanes = true;
    this.laneService
      .getLanes(poolId)
      .pipe(finalize(() => (this.isLoadingLanes = false)))
      .subscribe({
        next: (lanes) => {
          this.lanes = lanes;
        },
        error: (error: unknown) => {
          this.lanes = [];
          this.applyError(error);
        }
      });
  }

  private getSelectedCompanyId(): number | null {
    const companyId = Number(this.filterForm.controls.companyId.value);
    return Number.isFinite(companyId) && companyId > 0 ? companyId : null;
  }

  private getSelectedPoolId(): number | null {
    const poolId = Number(this.filterForm.controls.poolId.value);
    return Number.isFinite(poolId) && poolId > 0 ? poolId : null;
  }

  private applyError(error: unknown): void {
    this.error = this.apiErrorService.getMessage(error);
    this.fieldErrors = this.apiErrorService.getFieldErrors(error);
  }
}
