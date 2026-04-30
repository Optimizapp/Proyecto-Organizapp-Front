import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit {
  private companyService = inject(CompanyService);
  
  companies: Company[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las empresas. ¿Está el backend encendido?';
        this.loading = false;
        console.error(err);
      }
    });
  }
}