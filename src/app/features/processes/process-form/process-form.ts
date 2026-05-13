import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyResponse, PoolResponse, UserResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { PoolService } from '../../../services/pool.service';
import { UserService } from '../../../services/user.service';
import { CreateProcessRequest, ProcessStatus, UpdateProcessRequest } from '../models/process.model';
import { ProcessService } from '../process.service';

@Component({
  selector: 'app-process-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './process-form.html',
  styleUrl: './process-form.css'
})
export class ProcessForm implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);

  readonly statusOptions: ProcessStatus[] = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

  processId?: number;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  isLoadingCompanies = false;
  isLoadingUsers = false;
  isLoadingPools = false;
  error: string | null = null;
  fieldErrors: Record<string, string> = {};
  companies: CompanyResponse[] = [];
  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  pools: PoolResponse[] = [];

  private readonly destroy$ = new Subject<void>();

  processForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    category: [''],
    status: ['DRAFT' as ProcessStatus, Validators.required],
    companyId: [null as number | null, [Validators.required, Validators.min(1)]],
    userId: [{ value: null as number | null, disabled: true }, [Validators.required, Validators.min(1)]],
    mainPoolId: [{ value: null as number | null, disabled: true }, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private processService: ProcessService,
    private companyService: CompanyService,
    private userService: UserService,
    private poolService: PoolService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadUsers();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const idParam = params.get('id');
      const id = Number(idParam);

      if (!idParam) {
        this.processId = undefined;
        this.isEditMode = false;
        this.isLoading = false;
        return;
      }

      if (Number.isNaN(id) || id <= 0) {
        this.error = 'El identificador del proceso no es valido.';
        this.isLoading = false;
        return;
      }

      this.processId = id;
      this.isEditMode = true;
      this.loadProcess(id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveProcess(): void {
    this.error = null;
    this.fieldErrors = {};

    if (this.processForm.invalid || !this.getSelectedUserId() || !this.getSelectedPoolId()) {
      this.processForm.markAllAsTouched();
      this.processForm.controls.userId.enable();
      this.processForm.controls.mainPoolId.enable();
      this.processForm.controls.userId.markAsTouched();
      this.processForm.controls.mainPoolId.markAsTouched();
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

  onCompanyChange(): void {
    this.processForm.patchValue({
      userId: null,
      mainPoolId: null
    });
    this.processForm.controls.userId.disable();
    this.processForm.controls.mainPoolId.disable();
    delete this.fieldErrors['userId'];
    delete this.fieldErrors['mainPoolId'];

    const companyId = this.getSelectedCompanyId();
    this.filterUsersByCompany(companyId);

    if (companyId) {
      this.updateUserControlState();
      this.loadPools(companyId);
      return;
    }

    this.pools = [];
  }

  isInvalid(fieldName: keyof typeof this.processForm.controls): boolean {
    const field = this.processForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  getCompanyLabel(company: CompanyResponse): string {
    return company.nit ? `${company.name} - ${company.nit}` : company.name;
  }

  getUserLabel(user: UserResponse): string {
    return user.email ? `${user.name} - ${user.email}` : user.name;
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
          this.companies = [];
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }

  private loadUsers(): void {
    this.isLoadingUsers = true;

    this.userService
      .getUsers()
      .pipe(finalize(() => (this.isLoadingUsers = false)))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.filterUsersByCompany(this.getSelectedCompanyId());
          this.updateUserControlState();
        },
        error: (error: unknown) => {
          this.users = [];
          this.filteredUsers = [];
          this.processForm.controls.userId.disable();
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
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
          this.filterUsersByCompany(process.companyId);
          this.updateUserControlState();
          this.loadPools(process.companyId, process.mainPoolId);
        },
        error: (error: unknown) => {
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }

  private loadPools(companyId: number, selectedPoolId?: number): void {
    this.isLoadingPools = true;
    this.pools = [];
    this.processForm.controls.mainPoolId.disable();

    this.poolService
      .getPools(companyId)
      .pipe(finalize(() => (this.isLoadingPools = false)))
      .subscribe({
        next: (pools) => {
          this.pools = pools;
          this.processForm.controls.mainPoolId.enable();

          if (selectedPoolId) {
            this.processForm.patchValue({ mainPoolId: selectedPoolId });
          }
        },
        error: (error: unknown) => {
          this.pools = [];
          this.processForm.controls.mainPoolId.disable();
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

  private getSelectedCompanyId(): number | null {
    const companyId = Number(this.processForm.controls.companyId.value);
    return Number.isFinite(companyId) && companyId > 0 ? companyId : null;
  }

  private getSelectedUserId(): number | null {
    const userId = Number(this.processForm.getRawValue().userId);
    return Number.isFinite(userId) && userId > 0 ? userId : null;
  }

  private getSelectedPoolId(): number | null {
    const poolId = Number(this.processForm.getRawValue().mainPoolId);
    return Number.isFinite(poolId) && poolId > 0 ? poolId : null;
  }

  private filterUsersByCompany(companyId: number | null): void {
    this.filteredUsers = companyId
      ? this.users.filter((user) => user.companyId === companyId)
      : [];
  }

  private updateUserControlState(): void {
    if (this.getSelectedCompanyId() && !this.isLoadingUsers && this.filteredUsers.length > 0) {
      this.processForm.controls.userId.enable();
      return;
    }

    this.processForm.controls.userId.disable();
  }
}