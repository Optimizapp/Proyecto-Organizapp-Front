import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { CompanyResponse, PoolResponse } from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';
import { PoolService } from '../../../services/pool.service';

@Component({
  selector: 'app-pool-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="feature-page">
      <div class="page-header">
        <div>
          <h2>Pools</h2>
          <p>Pools reales asociados a una empresa.</p>
        </div>
        <a routerLink="/pools/new" class="primary-action">Nuevo pool</a>
      </div>

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
      </form>

      <div *ngIf="isLoadingPools" class="state-message">Cargando pools...</div>
      <div *ngIf="error" class="state-message error">{{ error }}</div>
      <div *ngIf="!isLoadingPools && filterForm.controls.companyId.value && pools.length === 0" class="state-message">
        No hay pools registrados para la empresa seleccionada.
      </div>

      <div *ngIf="pools.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pool of pools">
              <td>{{ pool.id }}</td>
              <td>{{ pool.name }}</td>
              <td>{{ pool.companyId }}</td>
              <td>{{ pool.description || '-' }}</td>
              <td>
                <a [routerLink]="['/pools', pool.id, 'edit']" class="text-action">Editar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }

      .toolbar {
        margin-bottom: 1.25rem;
      }

      label {
        display: grid;
        gap: 0.45rem;
        max-width: 360px;
        font-weight: 600;
      }

      select {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        font: inherit;
      }

      .primary-action,
      .text-action {
        color: var(--accent-color);
        font-weight: 600;
        text-decoration: none;
      }

      .primary-action {
        border: 1px solid var(--accent-color);
        border-radius: var(--radius-sm);
        padding: 0.7rem 1rem;
        white-space: nowrap;
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
export class PoolList implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  companies: CompanyResponse[] = [];
  pools: PoolResponse[] = [];
  isLoadingCompanies = false;
  isLoadingPools = false;
  error: string | null = null;

  filterForm = this.formBuilder.group({
    companyId: [null as number | null, Validators.required]
  });

  constructor(
    private companyService: CompanyService,
    private poolService: PoolService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  onCompanyChange(): void {
    this.pools = [];
    this.error = null;

    const companyId = this.getSelectedCompanyId();
    if (companyId) {
      this.loadPools(companyId);
    }
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
        error: (error: unknown) => {
          this.error = this.apiErrorService.getMessage(error);
        }
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
          this.error = this.apiErrorService.getMessage(error);
        }
      });
  }

  private getSelectedCompanyId(): number | null {
    const companyId = Number(this.filterForm.controls.companyId.value);
    return Number.isFinite(companyId) && companyId > 0 ? companyId : null;
  }
}
