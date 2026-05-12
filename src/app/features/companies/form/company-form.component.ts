import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { CreateCompanyRequest, UpdateCompanyRequest } from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  companyId?: number;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  fieldErrors: Record<string, string> = {};

  companyForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    nit: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    industry: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam) {
      return;
    }

    if (Number.isNaN(id) || id <= 0) {
      this.error = 'El identificador de la empresa no es valido.';
      return;
    }

    this.companyId = id;
    this.isEditMode = true;
    this.loadCompany(id);
  }

  saveCompany(): void {
    this.error = null;
    this.fieldErrors = {};

    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const request = this.buildRequest();
    this.isSaving = true;

    const save$ = this.isEditMode && this.companyId
      ? this.companyService.updateCompany(this.companyId, request as UpdateCompanyRequest)
      : this.companyService.createCompany(request as CreateCompanyRequest);

    save$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/companies']);
        },
        error: (error: unknown) => {
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/companies']);
  }

  isInvalid(fieldName: keyof typeof this.companyForm.controls): boolean {
    const field = this.companyForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  private loadCompany(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.fieldErrors = {};

    this.companyService
      .getCompanyById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (company) => {
          this.companyForm.patchValue({
            name: company.name,
            nit: company.nit,
            address: company.address ?? '',
            phone: company.phone ?? '',
            industry: company.industry ?? ''
          });
        },
        error: (error: unknown) => {
          this.error = this.apiErrorService.getMessage(error);
          this.fieldErrors = this.apiErrorService.getFieldErrors(error);
        }
      });
  }

  private buildRequest(): CreateCompanyRequest | UpdateCompanyRequest {
    const value = this.companyForm.getRawValue();

    return {
      name: value.name?.trim() ?? '',
      nit: value.nit?.trim() ?? '',
      address: value.address?.trim() ?? '',
      phone: value.phone?.trim() ?? '',
      industry: value.industry?.trim() || undefined
    };
  }
}
