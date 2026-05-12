import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { CompanyResponse } from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList implements OnInit {
  companies: CompanyResponse[] = [];
  isLoading = false;
  error: string | null = null;
  fieldErrors: Record<string, string> = {};

  constructor(
    private companyService: CompanyService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.error = null;
    this.fieldErrors = {};

    this.companyService
      .getCompanies()
      .pipe(finalize(() => (this.isLoading = false)))
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

  getInitial(company: CompanyResponse): string {
    return company.name.trim().charAt(0).toUpperCase() || 'E';
  }
}
