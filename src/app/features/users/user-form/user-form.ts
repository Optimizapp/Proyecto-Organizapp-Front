import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  CompanyResponse,
  CreateUserRequest,
  FormErrorMap,
  RoleResponse,
  UpdateUserRequest
} from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="feature-page">
      <div class="page-header">
        <div>
          <h2>{{ isEditMode ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
          <p>Asocia el usuario a una empresa y a un rol existente.</p>
        </div>
        <a routerLink="/users" class="text-action">Volver</a>
      </div>

      <div *ngIf="isLoading" class="state-message">Cargando usuario...</div>
      <div *ngIf="error" class="state-message error">{{ error }}</div>

      <form [formGroup]="userForm" (ngSubmit)="saveUser()" class="form-grid">
        <label>
          Nombre
          <input type="text" formControlName="name" />
          <small *ngIf="isInvalid('name')">El nombre es obligatorio.</small>
          <small *ngIf="fieldErrors['name']">{{ fieldErrors['name'] }}</small>
        </label>

        <label>
          Email
          <input type="email" formControlName="email" />
          <small *ngIf="isInvalid('email')">Ingresa un email valido.</small>
          <small *ngIf="fieldErrors['email']">{{ fieldErrors['email'] }}</small>
        </label>

        <label *ngIf="!isEditMode">
          Contraseña
          <input type="password" formControlName="password" />
          <small *ngIf="isInvalid('password')">La contraseña es obligatoria.</small>
          <small *ngIf="fieldErrors['password']">{{ fieldErrors['password'] }}</small>
        </label>

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
          <small *ngIf="isInvalid('companyId')">La empresa es obligatoria.</small>
        </label>

        <label>
          Rol
          <select formControlName="roleId">
            <option [ngValue]="null">
              {{ isLoadingRoles ? 'Cargando roles...' : 'Seleccione un rol' }}
            </option>
            <option *ngFor="let role of roles" [ngValue]="role.id">{{ role.name }}</option>
          </select>
          <small *ngIf="isInvalid('roleId')">El rol es obligatorio.</small>
          <small *ngIf="userForm.controls.companyId.value && !isLoadingRoles && roles.length === 0">
            No hay roles disponibles para la empresa seleccionada.
          </small>
        </label>

        <label *ngIf="isEditMode" class="checkbox-field">
          <input type="checkbox" formControlName="active" />
          Usuario activo
        </label>

        <div class="form-actions">
          <button type="submit" [disabled]="isSaving">
            {{ isSaving ? 'Guardando...' : 'Guardar usuario' }}
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
        color: var(--text-primary);
        font-weight: 600;
      }

      input,
      select {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        font: inherit;
      }

      small {
        color: #b42318;
        font-weight: 500;
      }

      .checkbox-field {
        display: flex;
        align-items: center;
      }

      .checkbox-field input {
        width: auto;
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
export class UserForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  isLoadingCompanies = false;
  isLoadingRoles = false;
  error: string | null = null;
  fieldErrors: FormErrorMap = {};
  companies: CompanyResponse[] = [];
  roles: RoleResponse[] = [];
  private userId: number | null = null;

  userForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    companyId: [null as number | null, Validators.required],
    roleId: [{ value: null as number | null, disabled: true }, Validators.required],
    active: [true]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private companyService: CompanyService,
    private roleService: RoleService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.isEditMode = true;
      this.userId = id;
      this.userForm.controls.password.clearValidators();
      this.userForm.controls.password.updateValueAndValidity();
      this.loadUser(id);
    }
  }

  onCompanyChange(): void {
    this.userForm.patchValue({ roleId: null });
    delete this.fieldErrors['roleId'];
    this.userForm.controls.roleId.disable();

    const companyId = this.getSelectedCompanyId();
    if (companyId) {
      this.loadRoles(companyId);
      return;
    }

    this.roles = [];
  }

  saveUser(): void {
    this.error = null;
    this.fieldErrors = {};

    if (this.userForm.invalid || !this.getSelectedRoleId()) {
      this.userForm.markAllAsTouched();
      this.userForm.controls.roleId.enable();
      this.userForm.controls.roleId.markAsTouched();
      return;
    }

    this.isSaving = true;
    const request = this.buildRequest();
    const operation =
      this.isEditMode && this.userId
        ? this.userService.updateUser(this.userId, request as UpdateUserRequest)
        : this.userService.createUser(request as CreateUserRequest);

    operation.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (error: unknown) => this.applyError(error)
    });
  }

  isInvalid(fieldName: keyof typeof this.userForm.controls): boolean {
    const field = this.userForm.controls[fieldName];
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

  private loadUser(id: number): void {
    this.isLoading = true;
    this.userService
      .getUserById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (user) => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            password: '',
            companyId: user.companyId,
            roleId: user.roleId,
            active: user.active
          });
          this.loadRoles(user.companyId, user.roleId);
        },
        error: (error: unknown) => this.applyError(error)
      });
  }

  private loadRoles(companyId: number, selectedRoleId?: number): void {
    this.isLoadingRoles = true;
    this.roles = [];
    this.userForm.controls.roleId.disable();

    this.roleService
      .getRoles({ companyId })
      .pipe(finalize(() => (this.isLoadingRoles = false)))
      .subscribe({
        next: (roles) => {
          this.roles = roles;
          this.userForm.controls.roleId.enable();
          if (selectedRoleId) {
            this.userForm.patchValue({ roleId: selectedRoleId });
          }
        },
        error: (error: unknown) => {
          this.roles = [];
          this.userForm.controls.roleId.disable();
          this.applyError(error);
        }
      });
  }

  private buildRequest(): CreateUserRequest | UpdateUserRequest {
    const value = this.userForm.getRawValue();
    const request: UpdateUserRequest = {
      name: value.name ?? '',
      email: value.email ?? '',
      companyId: Number(value.companyId),
      roleId: Number(value.roleId)
    };

    if (this.isEditMode) {
      request.active = Boolean(value.active);
    } else {
      return {
        ...request,
        password: value.password ?? ''
      } as CreateUserRequest;
    }

    return request;
  }

  private getSelectedCompanyId(): number | null {
    const companyId = Number(this.userForm.controls.companyId.value);
    return Number.isFinite(companyId) && companyId > 0 ? companyId : null;
  }

  private getSelectedRoleId(): number | null {
    const roleId = Number(this.userForm.getRawValue().roleId);
    return Number.isFinite(roleId) && roleId > 0 ? roleId : null;
  }

  private applyError(error: unknown): void {
    this.error = this.apiErrorService.getMessage(error);
    this.fieldErrors = this.apiErrorService.getFieldErrors(error);
  }
}
