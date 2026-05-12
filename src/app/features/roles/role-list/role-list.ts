import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, timeout } from 'rxjs';

import { CompanyResponse, FormErrorMap, RoleResponse } from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="feature-page">
      <h2>Roles</h2>
      <p>Roles reales disponibles por empresa.</p>

      <div *ngIf="error" class="state-message error">{{ error }}</div>

      <form [formGroup]="filterForm" class="toolbar">
        <label>
          Empresa
          <select formControlName="companyId" (change)="onCompanyChange()">
            <option [ngValue]="null">
              {{ isLoadingCompanies ? 'Cargando empresas...' : 'Seleccione una empresa' }}
            </option>
            <option *ngFor="let company of companies" [ngValue]="company.id">
              {{ getCompanyLabel(company) }}
            </option>
          </select>
        </label>
      </form>

      <form [formGroup]="roleForm" (ngSubmit)="createRole()" class="inline-form">
        <label>
          Nombre del rol
          <input type="text" formControlName="name" />
          <small *ngIf="isRoleInvalid('name')">El nombre del rol es obligatorio.</small>
          <small *ngIf="fieldErrors['name'] || fieldErrors['nombre']">
            {{ fieldErrors['name'] || fieldErrors['nombre'] }}
          </small>
        </label>
        <button type="submit" [disabled]="isSaving || !filterForm.controls.companyId.value">
          {{ isSaving ? 'Creando...' : 'Crear rol' }}
        </button>
      </form>

      <div *ngIf="isLoadingRoles" class="state-message">Cargando roles...</div>
      <div *ngIf="!isLoadingRoles && filterForm.controls.companyId.value && roles.length === 0" class="state-message">
        No hay roles registrados para la empresa seleccionada.
      </div>

      <div *ngIf="roles.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Proceso</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let role of roles">
              <td>{{ role.id }}</td>
              <td>{{ role.name }}</td>
              <td>{{ role.companyId ?? '-' }}</td>
              <td>{{ role.processId ?? '-' }}</td>
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
        min-width: 260px;
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
export class RoleList implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  companies: CompanyResponse[] = [];
  roles: RoleResponse[] = [];
  isLoadingCompanies = false;
  isLoadingRoles = false;
  isSaving = false;
  error: string | null = null;
  fieldErrors: FormErrorMap = {};

  filterForm = this.formBuilder.group({
    companyId: [null as number | null, Validators.required]
  });

  roleForm = this.formBuilder.group({
    name: ['', Validators.required]
  });

  constructor(
    private companyService: CompanyService,
    private roleService: RoleService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  onCompanyChange(): void {
    this.roles = [];
    this.error = null;

    const companyId = this.getSelectedCompanyId();
    if (companyId) {
      this.loadRoles(companyId);
    }
  }

  createRole(): void {
    this.error = null;
    this.fieldErrors = {};

    const companyId = this.getSelectedCompanyId();
    if (this.roleForm.invalid || !companyId) {
      this.roleForm.markAllAsTouched();
      this.filterForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.roleService
      .createRole({
        nombre: this.roleForm.controls.name.value ?? '',
        companyId,
        processId: null
      })
      .pipe(
        timeout(15000),
        finalize(() => (this.isSaving = false))
      )
      .subscribe({
        next: () => {
          this.roleForm.reset();
          this.loadRoles(companyId);
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  isRoleInvalid(fieldName: keyof typeof this.roleForm.controls): boolean {
    const field = this.roleForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  getCompanyLabel(company: CompanyResponse): string {
    return company.nit ? `${company.name} - ${company.nit}` : company.name;
  }

  private loadCompanies(): void {
    this.isLoadingCompanies = true;
    this.filterForm.controls.companyId.disable();
    this.companyService
      .getCompanies()
      .pipe(
        finalize(() => {
          this.isLoadingCompanies = false;
          this.filterForm.controls.companyId.enable();
        })
      )
      .subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  private loadRoles(companyId: number): void {
    this.isLoadingRoles = true;
    this.roleService
      .getRoles({ companyId })
      .pipe(finalize(() => (this.isLoadingRoles = false)))
      .subscribe({
        next: (roles) => {
          this.roles = roles;
        },
        error: (error: unknown) => {
          this.roles = [];
          this.applyError(error);
        }
      });
  }

  private getSelectedCompanyId(): number | null {
    const companyId = Number(this.filterForm.controls.companyId.value);
    return Number.isFinite(companyId) && companyId > 0 ? companyId : null;
  }

  private applyError(error: unknown): void {
    this.error = this.apiErrorService.getMessage(error);
    this.fieldErrors = this.apiErrorService.getFieldErrors(error);
    if (this.fieldErrors['nombre'] && !this.fieldErrors['name']) {
      this.fieldErrors = {
        ...this.fieldErrors,
        name: this.fieldErrors['nombre']
      };
    }
  }
}
